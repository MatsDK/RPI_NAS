import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import { useApolloClient } from "react-apollo";
import React, { useContext, useEffect } from "react";
import FolderItem from "./FolderItem";
import { FolderContext, FolderContextType } from "lib/providers/folderState";
import FolderNavbar from "./FolderNavbar";

interface Props {
  path: string;
}

const Folder: React.FC<Props> = ({ path }) => {
  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
    },
    client,
  });

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

  useEffect(() => {
    if (folderCtx) {
      folderCtx.selected.selectedItems = new Map();
      folderCtx.currentFolderPath = path;
    }
  }, [path]);

  return (
    <div>
      <FolderNavbar />
      {data.tree.tree.map((item, idx) => (
        <FolderItem item={item as TreeItem} key={idx} />
      ))}
    </div>
  );
};

export default Folder;
