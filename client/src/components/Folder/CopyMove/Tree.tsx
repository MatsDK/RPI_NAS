import { GetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { CreateFolderMutation } from "graphql/Folder/createFolder";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import fsPath from "path";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext } from "src/providers/folderState";
import { ArrowButton } from "src/ui/ArrowButton";
import { BgButton, Button, LoadingOverlay } from "src/ui/Button";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import { updateNewFolder } from "./updateNewFolder";

export type MoveCopyPath = { datastoreId: number; path: string };

interface TreeProps {
  setSelectedPath: React.Dispatch<React.SetStateAction<MoveCopyPath | null>>;
  selectedPath: MoveCopyPath | null;
  data: GetDirectoryTreeQueryQuery | undefined;
}

const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;

  ${Scrollbar}
`;

export const Tree: React.FC<TreeProps> = ({
  selectedPath,
  setSelectedPath,
  data,
}) => {
  return (
    <TreeWrapper>
      {data?.directoryTree?.tree?.map((item, idx) => (
        <TreeItem
          item={item}
          key={idx}
          setSelectedPath={setSelectedPath}
          selectedPath={selectedPath}
        />
      ))}
    </TreeWrapper>
  );
};

interface TreeItemProps {
  item: {
    isDirectory: boolean;
    dataStoreId?: number | null;
    sharedDataStore?: boolean | null;
    name: string;
    relativePath: string;
    path: string;
  };
  setSelectedPath: React.Dispatch<React.SetStateAction<MoveCopyPath | null>>;
  selectedPath: MoveCopyPath | null;
}

const NestedItems = styled.div`
  margin-left: 7px;
  padding-left: 7px;
  border-left: 1px solid ${(props) => props.theme.lightBgColors[2]};
`;

const TreeItemWrapper = styled.div``;

const FolderItem = styled.div`
  display: flex;
  align-items: center;

  > button {
    opacity: 0;
    color: ${props => props.theme.textColors[2]};
    transition: opacity .15s ease-in-out;
    font-size: 14px;
  }

  :hover > button {
    opacity: 1;
  }
`;

interface FolderNameProps {
  selected: boolean;
  isDatastore: boolean
}

const FolderName = styled.div<FolderNameProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.lightBgColors[1] : "transparent"};
  font-weight: ${props => props.selected || props.isDatastore ? "500" : "normal"};
  color: ${(props) =>
    props.selected || props.isDatastore ? props.theme.textColors[0] : props.theme.textColors[1]};
  padding: 2px 5px;
  margin-left: 5px;
  border-radius: 3px;
  cursor: pointer;
`;

const NewFolderInput = styled.input`
  font-size: 14px;
  height: 28px;
  border: 1px solid ${props => props.theme.textColors[3]};
  padding: 0 5px;
  border-radius: 3px;
  margin-right: 5px;
  outline: 0;
`

const Form = styled.form`
  display: flex;
  align-items: center;
`

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  selectedPath,
  setSelectedPath,
}) => {
  const { query, mutate } = useApollo();

  const folderCtx = useContext(FolderContext)

  const [loading, setLoading] = useState(false);
  const [showNestedItems, setShowNestedItems] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [nestedItems, setNestedItems] = useState<any[] | null>(null);

  const queryNested = () => {
    query(getDirectoryTreeQuery, {
      depth: 1,
      path: item.relativePath,
      datastoreId: item.dataStoreId,
    }).then((res) => {
      setNestedItems(res.data.directoryTree.tree || [])
    });
  }

  useEffect(() => {
    if (showNestedItems) queryNested()

    return () => { };
  }, [item, showNestedItems]);

  const createNewFolder = async (e: FormEvent) => {
    e.preventDefault()

    const newFolderName = (e.target[0].value || "").trim()

    const newFolderFullPath = fsPath.join(
      folderCtx?.currentFolderPath?.folderPath.path || "",
      newFolderName
    );

    if (!newFolderName || !newFolderFullPath.trim() || item.dataStoreId == null) return

    try {
      setLoading(true)

      const { data, errors } = await mutate(CreateFolderMutation,
        {
          path: newFolderFullPath,
          datastoreId: item.dataStoreId,
        },
        {
          refetchQueries: [
            {
              query: getDirectoryTreeQuery,
              variables: {
                depth: 1,
                path: item.relativePath,
                datastoreId: item.dataStoreId,
              },
            },
          ],
          update: updateNewFolder(newFolderFullPath, item.relativePath, item.dataStoreId)
        }
      )

      setLoading(false)
      setShowNewFolderInput(false)
      e.target[0].value = ""

      queryNested()

      console.log(data, errors)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  return (
    <TreeItemWrapper>
      <FolderItem>
        <ArrowButton
          onClick={() => setShowNestedItems((s) => !s)}
          active={showNestedItems}
        >
          <Icon
            name={"folderArrow"}
            color={{ propName: "lightBgColors", idx: 2 }}
            width={13}
            height={13}
            viewPort={15}
          />
        </ArrowButton>
        <FolderName
          selected={
            selectedPath?.datastoreId == item.dataStoreId &&
            selectedPath?.path === item.relativePath
          }
          isDatastore={!item.relativePath}
          onClick={() =>
            setSelectedPath({
              datastoreId: item.dataStoreId || 0,
              path: item.relativePath,
            })
          }
        >
          {item.name}
        </FolderName>
        <Button onClick={() => {
          const newState = !showNewFolderInput
          if (newState) setShowNestedItems(true)
          setShowNewFolderInput(newState)
        }}>New folder</Button>
      </FolderItem>
      {showNestedItems && (
        <NestedItems>
          {showNewFolderInput &&
            <Form onSubmit={createNewFolder}>
              <NewFolderInput />
              <LoadingOverlay loading={loading}>
                <BgButton name="folder-name" type="submit">Create folder</BgButton>
              </LoadingOverlay>
              <Button onClick={() => setShowNewFolderInput(false)}>Cancel</Button>
            </Form>
          }
          {(nestedItems || []).map((v, idx) => (
            <TreeItem
              key={idx}
              setSelectedPath={setSelectedPath}
              selectedPath={selectedPath}
              item={{ ...v, dataStoreId: item.dataStoreId }}
            />
          ))}
        </NestedItems>
      )}
    </TreeItemWrapper>
  );
};
