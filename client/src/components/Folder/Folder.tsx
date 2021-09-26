import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import { FolderItemWrapper, IconWrapper } from "./FolderItem";
import fsPath from "path";
import { useApolloClient } from "react-apollo";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import FolderNavbar from "./FolderNavbar";
import styled from "styled-components";
import { CreateFolderMutation } from "graphql/Folder/createFolder";
import Icon from "../../ui/Icon";
import { FolderPath } from "./FolderPath";

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
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Folder: React.FC<Props> = ({ path, dataStoreId, dataStoreName }) => {
  if (!dataStoreId) return null;

  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderNameInput, setFolderNameInput] = useState("");

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
      dataStoreId: dataStoreId,
    },
    client,
  });

  useEffect(() => {
    if (folderCtx) {
      const { selected, currentFolderPath } = folderCtx;

      selected.selectedItems = new Map();
      currentFolderPath?.setFolderPath({ path, dataStoreId, dataStoreName });
    }
  }, [path]);

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

  const createNewFolder = async (e: FormEvent) => {
    e.preventDefault();
    const path = fsPath.join(
      folderCtx?.currentFolderPath?.folderPath.path || "",
      folderNameInput
    );

    if (!folderNameInput.trim() || !path.trim()) return;

    const res = await client.mutate({
      mutation: CreateFolderMutation,
      variables: {
        path,
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
      },
    });

    console.log(res);
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
                <input
                  type="text"
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
        <div style={{ minHeight: 300, flex: 1 }}></div>
      </FolderContainer>
    </div>
  );
};

export default Folder;
