import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";

interface Props {
  item: TreeItem;
}

const Item: React.FC<Props> = ({ item }) => {
  const [nestedItems, setNestedItems] = useState<TreeItem[] | null>(null);
  const [showNestedItems, setShowNestedItems] = useState(false);

  const client: any = useApolloClient();

  const { refetch } = useGetTreeQueryQuery({
    client: client,
    skip: true,
    variables: {
      depth: 1,
      path: item.path,
    },
  });

  return item.isDirectory ? (
    <div
      onClick={async () => {
        if (!nestedItems) {
          const { error, loading, data } = await refetch();

          if (loading) return null;

          if (error) return console.log(error);

          setNestedItems((data?.tree?.tree as TreeItem[]) || []);
        }

        setShowNestedItems((showNestedItems) => !showNestedItems);
      }}
    >
      {item.name}
      {showNestedItems &&
        nestedItems &&
        nestedItems.map((i, idx) => <Item item={i} key={idx} />)}
    </div>
  ) : (
    <div>{item.name}</div>
  );
};

export default Item;
