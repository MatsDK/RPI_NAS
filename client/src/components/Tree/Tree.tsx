import {
  TreeItem,
  useGetDirectoryTreeQueryQuery,
} from "generated/apolloComponents";
import React, { useContext } from "react";
import { useApolloClient } from "react-apollo";
import { FolderContext } from "src/providers/folderState";
import TreeObjectItem from "./TreeItem";

interface Props {
  path?: string;
}

const Tree: React.FC<Props> = ({ path = "/" }) => {
  const client: any = useApolloClient();
  const FolderCtx = useContext(FolderContext);

  const { data, loading, error } = useGetDirectoryTreeQueryQuery({
    client,
    variables: {
      depth: 1,
      path,
      dataStoreId: null,
    },
  });

  // useEffect(() => {
  //   // console.log(FolderCtx?.currentFolderPath);

  //   return () => {};
  // }, [FolderCtx?.currentFolderPath?.folderPath]);

  if (loading) return <div>loading..</div>;
  if (error) return <div>errors</div>;

  if (!data?.directoryTree?.tree) return <div>Tree not found</div>;

  return (
    <div style={{ minWidth: 300, overflowY: "auto", height: "100vh" }}>
      {data.directoryTree.tree.map((item, idx) => {
        return (
          <TreeObjectItem
            showNested={
              FolderCtx?.currentFolderPath?.folderPath.dataStoreId ===
              item.dataStoreId
            }
            dataStoreId={item.dataStoreId}
            item={item as TreeItem}
            key={idx}
          />
        );
      })}
    </div>
  );
};

export default Tree;
