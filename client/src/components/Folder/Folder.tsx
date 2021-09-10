import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import { useApolloClient } from "react-apollo";
import React, { useContext, useEffect } from "react";
import FolderItem from "./FolderItem";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import FolderNavbar from "./FolderNavbar";

interface Props {
  path: string;
  dataStoreId: number | null;
}

const Folder: React.FC<Props> = ({ path, dataStoreId }) => {
  if (!dataStoreId) return null;

  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

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

  return (
    <div>
      <FolderNavbar />
      {data.tree.tree.map((item, idx) => (
        <FolderItem
          dataStoreId={dataStoreId}
          item={item as TreeItem}
          key={idx}
        />
      ))}
    </div>
  );
};

export default Folder;
