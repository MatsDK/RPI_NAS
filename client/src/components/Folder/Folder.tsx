import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import { FolderItemWrapper, IconWrapper } from "./FolderItem";
import fsPath from "path";
import { useApolloClient } from "react-apollo";
import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FolderItem from "./FolderItem";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import FolderNavbar from "./FolderNavbar";
import styled from "styled-components";
import { CreateFolderMutation } from "graphql/Folder/createFolder";
import Icon from "../../ui/Icon";
import { FolderPath } from "./FolderPath";
import { Scrollbar } from "src/ui/Scrollbar";
import { useApollo } from "src/hooks/useApollo";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { update } from "./newFolderUpdateQuery";
import { ConditionOverlay } from "../ConditionOverlay";
import { InitDatastoreOverlay } from "./InitDatastoreOverlay";

interface Props {
  path: string;
  datastoreId: number | null;
  datastoreName: string;
}

const FolderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FolderContainer = styled.div`
  ${Scrollbar}

  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NewFolderInput = styled.input`
  border: 0;
  outline: 0;
  padding: 1px 2px;
  font-size: 16px;
  border-bottom: 1px solid ${(props) => props.theme.lightBgColors[2]};
`;

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const sort = (data: any[]) =>
  data.sort((a, b) => (b.isDirectory ? 1 : 0) - (a.isDirectory ? 1 : 0))


const Folder: React.FC<Props> = ({ path, datastoreId, datastoreName }) => {
  if (!datastoreId) return null;

  const { mutate } = useApollo();
  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderNameInput, setFolderNameInput] = useState("");

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (folderCtx?.newFolderInput?.showNewFolderInput)
      inputRef.current?.focus();

    if (folderCtx && !folderCtx.currentFolderPath?.folderPath.datastoreName)
      folderCtx.currentFolderPath?.setFolderPath({ path, datastoreId, datastoreName });
  }, [folderCtx]);

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
      datastoreId,
    },
    client,
  });

  useEffect(() => {
    if (folderCtx) {
      const { selected, currentFolderPath } = folderCtx;

      folderCtx.selected?.setSelected?.(new Map());

      selected.selectedItems = new Map();
      currentFolderPath?.setFolderPath({ path, datastoreId, datastoreName });
    }
  }, [path]);

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

  const initialized = !!data?.tree?.userInitialized

  const createNewFolder = async (e: FormEvent) => {
    e.preventDefault();
    const newPath = fsPath.join(
      folderCtx?.currentFolderPath?.folderPath.path || "",
      folderNameInput
    );

    if (!folderNameInput.trim() || !newPath.trim()) return;

    await mutate(
      CreateFolderMutation,
      {
        path: newPath,
        datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
      },
      {
        refetchQueries: [
          {
            query: getDirectoryTreeQuery,
            variables: {
              depth: 1,
              path: folderCtx?.currentFolderPath?.folderPath.path,
              datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
            },
          },
        ],
        update: update(newPath, path, datastoreId)
      },
    );

    folderCtx?.newFolderInput?.setShowNewFolderInput(false);
    setFolderNameInput("");
  };


  return (
    <Wrapper>
      <ConditionOverlay
        condition={!initialized}
        renderOverlay={() => <InitDatastoreOverlay datastoreName={datastoreName} datastoreId={datastoreId} />}
      >
        <FolderNavbar />
        <FolderContainer>
          <FolderPath
            path={path.split("/")}
            dataStore={{
              id: datastoreId,
              name: datastoreName,
            }}
          />
          <FolderContent>
            {folderCtx?.newFolderInput?.showNewFolderInput && (
              <FolderItemWrapper>
                <div style={{ width: 38 }} />
                <IconWrapper>
                  <Icon
                    color={{ idx: 2, propName: "bgColors" }}
                    width={24}
                    height={22}
                    viewPort={30}
                    name="folderIcon"
                  />
                </IconWrapper>
                <form onSubmit={createNewFolder}>
                  <NewFolderInput
                    type="text"
                    ref={inputRef as any}
                    value={folderNameInput}
                    onChange={(e) => setFolderNameInput(e.target.value)}
                  />
                </form>
              </FolderItemWrapper>
            )}
            {(initialized ? sort(data.tree?.tree) : []).map((item, idx) => (
              <FolderItem
                datastoreId={datastoreId}
                item={item as TreeItem}
                idx={idx}
                items={sort(data.tree?.tree || [])}
                key={idx}
              />
            ))}
          </FolderContent>
          <div
            style={{ minHeight: 300, flex: 1 }}
            onClick={() => folderCtx?.selected?.setSelected?.(new Map())}
          ></div>
        </FolderContainer>
      </ConditionOverlay>
    </Wrapper>
  );
};

export default Folder;
