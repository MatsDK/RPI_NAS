import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import fsPath from "path";
import { useApolloClient } from "react-apollo";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import FolderNavbar from "./FolderNavbar";
import styled from "styled-components";
import { CreateFolderMutation } from "graphql/Folder/createFolder";

interface Props {
  path: string;
  dataStoreId: number | null;
}

const FolderContent = styled.div`
  overflow: scroll;
  height: 100%;
`;

const Folder: React.FC<Props> = ({ path, dataStoreId }) => {
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
      currentFolderPath?.setFolderPath({ path, dataStoreId });
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
    <div style={{ width: "100%" }}>
      <FolderNavbar />
      <FolderContent>
        {folderCtx?.newFolderInput?.showNewFolderInput && (
          <form onSubmit={createNewFolder}>
            <input
              type="text"
              value={folderNameInput}
              onChange={(e) => setFolderNameInput(e.target.value)}
            />
          </form>
        )}
        {data.tree.tree.map((item, idx) => (
          <FolderItem
            dataStoreId={dataStoreId}
            item={item as TreeItem}
            key={idx}
          />
        ))}
      </FolderContent>
    </div>
  );
};

export default Folder;
