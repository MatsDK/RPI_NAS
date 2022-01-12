import { ApolloQueryResult } from "apollo-boost";
import { GetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { ArrowButton } from "src/ui/ArrowButton";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";

export type MoveCopyPath = { datastoreId: number; path: string };

interface TreeProps {
  setSelectedPath: React.Dispatch<React.SetStateAction<MoveCopyPath | null>>;
  selectedPath: MoveCopyPath | null;
  data: GetDirectoryTreeQueryQuery | undefined;
}

const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;

  ${Scrollbar}
`;

export const Tree: React.FC<TreeProps> = ({
  selectedPath,
  setSelectedPath,
  data,
}) => {
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
  margin-left: 7px;
  padding-left: 7px;
  border-left: 1px solid ${(props) => props.theme.bgColors[1]};
`;

const TreeItemWrapper = styled.div``;

const FolderItem = styled.div`
  display: flex;
  align-items: center;
`;

interface FolderNameProps {
  selected: boolean;
}

const FolderName = styled.div<FolderNameProps>`
  background-color: ${(props) =>
    props.selected ? props.theme.bgColors[2] : "transparent"};
  color: ${(props) =>
    props.selected ? props.theme.textColors[2] : props.theme.textColors[3]};
  padding: 2px 5px;
  margin-left: 5px;
  border-radius: 3px;
  cursor: pointer;
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

    return () => { };
  }, [item, showNestedItems]);

  return (
    <TreeItemWrapper>
      <FolderItem>
        <ArrowButton
          onClick={() => setShowNestedItems((s) => !s)}
          active={showNestedItems}
        >
          <Icon
            name={"folderArrow"}
            color={{ propName: "textColors", idx: 2 }}
            width={13}
            height={13}
            viewPort={15}
          />
        </ArrowButton>
        <FolderName
          selected={
            selectedPath?.datastoreId == item.dataStoreId &&
            selectedPath?.path === item.relativePath
          }
          onClick={() =>
            setSelectedPath({
              datastoreId: item.dataStoreId || 0,
              path: item.relativePath,
            })
          }
        >
          {item.name}
        </FolderName>
      </FolderItem>

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
    </TreeItemWrapper>
  );
};
