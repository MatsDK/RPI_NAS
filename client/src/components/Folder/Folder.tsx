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
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useApollo } from "src/hooks/useApollo";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";

interface Props {
  path: string;
  dataStoreId: number | null;
  dataStoreName: string;
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

const Folder: React.FC<Props> = ({ path, dataStoreId, dataStoreName }) => {
  if (!dataStoreId) return null;

  const { mutate } = useApollo();
  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderNameInput, setFolderNameInput] = useState("");

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (folderCtx?.newFolderInput?.showNewFolderInput)
      inputRef.current?.focus();
  }, [folderCtx]);

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
      dataStoreId,
    },
    client,
  });

  useEffect(() => {
    if (folderCtx) {
      const { selected, currentFolderPath } = folderCtx;

      folderCtx.selected?.setSelected?.(new Map());

      selected.selectedItems = new Map();
      currentFolderPath?.setFolderPath({ path, dataStoreId, dataStoreName });
    }
  }, [path]);

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

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
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
      },
      {
        refetchQueries: [
          {
            query: getDirectoryTreeQuery,
            variables: {
              depth: 1,
              path: folderCtx?.currentFolderPath?.folderPath.path,
              dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
            },
          },
        ],
        update: (cache, { data }) => {
          try {
            const cacheData: any = cache.readQuery({
              query: getTreeQuery,
              variables: { depth: 1, path, dataStoreId },
            });

            if (!data.createFolder || !cacheData?.tree) return;

            const newItem = {
              relativePath: newPath,
              isDirectory: true,
              path: data.createFolder,
              name: fsPath.basename(newPath),
              __typename: "TreeItem",
            };

            cacheData.tree.tree = [newItem, ...cacheData.tree.tree];

            cache.writeQuery({
              query: getTreeQuery,
              variables: { depth: 1, path, dataStoreId },
              data: cacheData,
            });
          } catch (error) {
            console.log(error);
          }
        },
      }
    );

    folderCtx?.newFolderInput?.setShowNewFolderInput(false);
    setFolderNameInput("");
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <FolderNavbar />
      <FolderContainer>
        <FolderPath
          path={path.split("/")}
          dataStore={{
            id: dataStoreId,
            name: dataStoreName,
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
          {data.tree.tree
            .sort((a, b) => (b.isDirectory ? 1 : 0) - (a.isDirectory ? 1 : 0))
            .map((item, idx) => (
              <FolderItem
                dataStoreId={dataStoreId}
                item={item as TreeItem}
                key={idx}
              />
            ))}
        </FolderContent>
        <div
          style={{ minHeight: 300, flex: 1 }}
          onClick={() => folderCtx?.selected?.setSelected?.(new Map())}
        ></div>
      </FolderContainer>
    </div>
  );
};

export default Folder;
