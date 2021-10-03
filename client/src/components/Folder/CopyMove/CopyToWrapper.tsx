import { ApolloQueryResult } from "apollo-boost";
import { ConditionButton, LightBgButton } from "src/ui/Button";
import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import React, { useContext, useEffect, useState } from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import MenuOverlay from "../../MenuOverlay";
import { FolderContext } from "src/providers/folderState";
import { CopyDataMutation } from "graphql/Folder/copyData";

interface CopyToWrapperProps {
  hide: () => any;
}

type copyToPath = { dataStoreId: number; path: string };

const CopyToContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
`;

const CopyToBottomContainer = styled.div`
  padding: 10px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.bgColors[1]};
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 36px;
  color: ${(props) => props.theme.textColors[3]};
  border-bottom: 1px solid ${(props) => props.theme.bgColors[1]};
  padding-bottom: 10px;
  margin-bottom: 5px;
`;

export const CopyToWrapper: React.FC<CopyToWrapperProps> = ({ hide }) => {
  const { mutate } = useApollo();

  const [copyToPath, setCopyToPath] = useState<null | copyToPath>(null);

  const folderCtx = useContext(FolderContext);

  const copy = async () => {
    const selectedData = Array.from(
      folderCtx?.selected.selectedItems || []
    ).map(([_, v]) => ({
      path: v.relativePath,
      type: v.isDirectory ? "directory" : "file",
    }));

    if (!selectedData) return;

    const { errors, data } = await mutate(CopyDataMutation, {
      data: selectedData,
      dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
      destination: copyToPath,
    });

    if (errors) return console.log(errors);

    console.log(data);
  };

  return (
    <MenuOverlay maxWidth={"25vw"} hide={hide}>
      <CopyToContainer>
        <Title>Copy To</Title>
        <Tree setSelectedPath={setCopyToPath} selectedPath={copyToPath} />
        <CopyToBottomContainer>
          <ConditionButton condition={!!copyToPath}>
            <LightBgButton onClick={copy}>Copy</LightBgButton>
          </ConditionButton>
        </CopyToBottomContainer>
      </CopyToContainer>
    </MenuOverlay>
  );
};

interface TreeProps {
  setSelectedPath: React.Dispatch<React.SetStateAction<copyToPath | null>>;
  selectedPath: copyToPath | null;
}

const TreeWrapper = styled.div`
  flex: 1;
  overflow: auto;

  ${Scrollbar}
`;

const Tree: React.FC<TreeProps> = ({ selectedPath, setSelectedPath }) => {
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
  setSelectedPath: React.Dispatch<React.SetStateAction<copyToPath | null>>;
  selectedPath: copyToPath | null;
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
