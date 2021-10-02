import {
  TreeItem,
  useGetDirectoryTreeQueryQuery,
} from "generated/apolloComponents";
import React, { useContext } from "react";
import { useApolloClient } from "react-apollo";
import { FolderContext } from "src/providers/folderState";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import TreeObjectItem from "./TreeItem";

interface Props {
  path?: string;
}

const TreeWrapper = styled.div`
  ${Scrollbar}

  min-width: 280px;
  max-width: 280px;
  overflow: auto;
  height: calc(100% - 65px);
  padding: 25px 0 0 30px;
`;

const TreeContent = styled.div`
  width: fit-content;
  height: fit-content;
  white-space: nowrap;
`;

const TreeHeader = styled.h1`
  white-space: nowrap;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  line-height: 29px;
  display: flex;
  align-items: baseline;

  p {
    margin-left: 5px;
    color: ${(props) => props.theme.textColors[2]};
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    span {
      font-weight: 500;
      margin-right: 3px;
    }
  }

  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  margin-bottom: 10px;
`;

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

  if (loading) return <div>loading..</div>;

  if (error) return <div>errors</div>;

  if (!data?.directoryTree?.tree) return <div>Tree not found</div>;

  return (
    <TreeWrapper>
      <div style={{ width: "fit-content", height: "fit-content" }}>
        <TreeHeader>
          Folder Tree{" "}
          <p>
            <span>{data.directoryTree.tree.length}</span>DataStore
            {data.directoryTree.tree.length !== 1 && "s"}
          </p>
        </TreeHeader>
        <TreeContent>
          {data.directoryTree.tree.map((item, idx) => (
            <TreeObjectItem
              showNested={
                FolderCtx?.currentFolderPath?.folderPath.dataStoreId ===
                item.dataStoreId
              }
              dataStoreId={item.dataStoreId}
              item={item as TreeItem}
              key={idx}
            />
          ))}
        </TreeContent>
      </div>
    </TreeWrapper>
  );
};

export default Tree;
