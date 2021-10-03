import { ApolloQueryResult } from "apollo-boost";
import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { useState, useEffect } from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";

export type MoveCopyPath = { dataStoreId: number; path: string };

interface TreeProps {
  setSelectedPath: React.Dispatch<React.SetStateAction<MoveCopyPath | null>>;
  selectedPath: MoveCopyPath | null;
}

const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;

  ${Scrollbar}
`;

export const Tree: React.FC<TreeProps> = ({
  selectedPath,
  setSelectedPath,
}) => {
  const client: any = useApolloClient();

  const { data, error, loading } = useGetDirectoryTreeQueryQuery({
    client,
    variables: { depth: 1, path: "/" },
  });

  if (loading) return <div>Loading...</div>;

  if (error) {
    console.log(error);
    return null;
  }

  return (
    <TreeWrapper>
      {data?.directoryTree?.tree?.map((item, idx) => (
        <TreeItem
          item={item}
          key={idx}
          setSelectedPath={setSelectedPath}
          selectedPath={selectedPath}
        />
      ))}
    </TreeWrapper>
  );
};

interface TreeItemProps {
  item: {
    isDirectory: boolean;
    dataStoreId?: number | null;
    sharedDataStore?: boolean | null;
    name: string;
    relativePath: string;
    path: string;
  };
  setSelectedPath: React.Dispatch<React.SetStateAction<MoveCopyPath | null>>;
  selectedPath: MoveCopyPath | null;
}

const NestedItems = styled.div`
  margin-left: 10px;
`;

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  selectedPath,
  setSelectedPath,
}) => {
  const { query } = useApollo();

  const [showNestedItems, setShowNestedItems] = useState(false);
  const [nestedItems, setNestedItems] = useState<ApolloQueryResult<any> | null>(
    null
  );

  useEffect(() => {
    if (showNestedItems)
      query(getDirectoryTreeQuery, {
        depth: 1,
        path: item.relativePath,
        dataStoreId: item.dataStoreId,
      }).then((res) => setNestedItems(res));

    return () => {};
  }, [item, showNestedItems]);

  return (
    <div>
      <div>
        <button onClick={() => setShowNestedItems((s) => !s)}>arrow</button>
        <span
          onClick={() =>
            setSelectedPath({
              dataStoreId: item.dataStoreId || 0,
              path: item.relativePath,
            })
          }
        >
          {item.name}
        </span>

        {selectedPath?.dataStoreId == item.dataStoreId &&
          selectedPath?.path === item.relativePath &&
          "selected"}
      </div>

      {showNestedItems && (
        <NestedItems>
          {nestedItems?.data.directoryTree?.tree?.map((v, idx) => (
            <TreeItem
              key={idx}
              setSelectedPath={setSelectedPath}
              selectedPath={selectedPath}
              item={{ ...v, dataStoreId: item.dataStoreId }}
            />
          ))}
        </NestedItems>
      )}
    </div>
  );
};
