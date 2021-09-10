import {
  TreeItem,
  useGetDirectoryTreeQueryQuery,
} from "generated/apolloComponents";
import { useRouter } from "next/dist/client/router";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { FolderContext } from "src/providers/folderState";

interface Props {
  item: TreeItem;
  dataStoreId?: number | null;
  showNested?: boolean;
}

const Item: React.FC<Props> = ({ item, dataStoreId, showNested = false }) => {
  const [nestedItems, setNestedItems] = useState<TreeItem[] | null>(null);
  const [showNestedItems, setShowNestedItems] = useState(showNested);

  const router = useRouter();
  const client: any = useApolloClient();
  const FolderCtx = useContext(FolderContext);

  const {
    loading,
    data,
    error,
    refetch: fetchTree,
  } = useGetDirectoryTreeQueryQuery({
    client: client,
    skip: !showNested,
    variables: {
      depth: 1,
      path: item.relativePath,
      dataStoreId,
    },
  });

  useEffect(() => {
    // if (!showNestedItems) setShowNestedItems(showNested);
    setShowNestedItems(showNested);
    if (showNested) {
      if (loading) return;

      if (error || !data?.directoryTree.tree) {
        console.log(error);
        return;
      }

      setNestedItems(() => data.directoryTree.tree || null);
    }
  }, [loading, error, data, showNested]);

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
            router.push(`/path/${item.relativePath}?d=${dataStoreId}`);
          }}
        >
          {item.name}
        </div>
      </div>
      <div style={{ marginLeft: 20 }}>
        {showNestedItems &&
          nestedItems &&
          nestedItems.map((i, idx) => {
            const show =
              !!FolderCtx?.currentFolderPath?.folderPath.path?.startsWith(
                i.relativePath.replace(/\\/g, "/")
              );

            return (
              <Item
                dataStoreId={dataStoreId}
                showNested={show}
                item={i}
                key={idx}
              />
            );
          })}
      </div>
    </>
  ) : (
    <div>{item.name}</div>
  );
};

export default Item;
