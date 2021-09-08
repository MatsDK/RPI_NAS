import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import React from "react";
import { useApolloClient } from "react-apollo";
import { TreeItem } from "generated/apolloComponents";
import TreeObjectItem from "./TreeItem";

interface Props {
  path?: string;
  dataStoreId: number | null;
}

const Tree: React.FC<Props> = ({ path = "/", dataStoreId }) => {
  const client: any = useApolloClient();

  const { data, loading, error } = useGetDirectoryTreeQueryQuery({
    client,
    variables: {
      depth: 1,
      path,
      dataStoreId: null,
    },
  });

  if (loading) return <div>loading..</div>;
  if (error) return <div>errors</div>;

  if (!data?.directoryTree?.tree) return <div>Tree not found</div>;

  return (
    <div style={{ minWidth: 300, overflowY: "auto", height: "100vh" }}>
      {data.directoryTree.tree.map((item, idx) => (
        <TreeObjectItem
          dataStoreId={item.dataStoreId}
          item={item as TreeItem}
          key={idx}
        />
      ))}
    </div>
  );
};

export default Tree;
