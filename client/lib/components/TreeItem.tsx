import {
  TreeItem,
  useGetDirectoryTreeQueryQuery,
} from "generated/apolloComponents";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { useApolloClient } from "react-apollo";

interface Props {
  item: TreeItem;
}

const Item: React.FC<Props> = ({ item }) => {
  const [nestedItems, setNestedItems] = useState<TreeItem[] | null>(null);
  const [showNestedItems, setShowNestedItems] = useState(false);

  const router = useRouter();
  const client: any = useApolloClient();

  const { refetch: fetchTree } = useGetDirectoryTreeQueryQuery({
    client: client,
    skip: true,
    variables: {
      depth: 1,
      path: item.relativePath,
    },
  });

  return item.isDirectory ? (
    <>
      <div style={{ display: "flex" }}>
        <button
          onClick={async () => {
            if (!nestedItems) {
              const { error, loading, data } = await fetchTree();

              if (loading) return console.log("loading");

              if (error) return console.log(error);

              setNestedItems((data?.directoryTree?.tree as TreeItem[]) || []);
            }

            setShowNestedItems((showNestedItems) => !showNestedItems);
          }}
        >
          arrow
        </button>
        <div
          onClick={() => {
            router.push(`/path/${item.relativePath}`);
          }}
        >
          {item.name}
        </div>
      </div>
      <div style={{ marginLeft: 20 }}>
        {showNestedItems &&
          nestedItems &&
          nestedItems.map((i, idx) => <Item item={i} key={idx} />)}
      </div>
    </>
  ) : (
    <div>{item.name}</div>
  );
};

export default Item;
