import { MoveDataMutation } from "graphql/Folder/moveData";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import React, { useContext, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext } from "src/providers/folderState";
import { ConditionButton, LightBgButton } from "src/ui/Button";
import styled from "styled-components";
import MenuOverlay from "../../MenuOverlay";
import { MoveCopyPath, Tree } from "./Tree";

interface MoveToWrapperProps {
  hide: () => any;
}

const MoveToContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
`;

const MoveToBottomContainer = styled.div`
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

export const MoveToWrapper: React.FC<MoveToWrapperProps> = ({ hide }) => {
  const { mutate } = useApollo();

  const [movePath, setMovePath] = useState<null | MoveCopyPath>(null);

  const folderCtx = useContext(FolderContext);

  const move = async () => {
    const selectedData = Array.from(
      folderCtx?.selected.selectedItems || []
    ).map(([_, v]) => ({
      path: v.relativePath,
      type: v.isDirectory ? "directory" : "file",
    }));

    if (!selectedData) return;

    const { errors, data } = await mutate(
      MoveDataMutation,
      {
        data: selectedData,
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
        destination: movePath,
      },
      {
        refetchQueries: [
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              dataStoreId: movePath?.dataStoreId,
              path: movePath?.path,
            },
          },
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
              path: folderCtx?.currentFolderPath?.folderPath.path,
            },
          },
        ],
      }
    );

    if (errors) return console.log(errors);

    console.log(data);
  };

  return (
    <MenuOverlay maxWidth={"25vw"} hide={hide}>
      <MoveToContainer>
        <Title>Move To</Title>
        <Tree setSelectedPath={setMovePath} selectedPath={movePath} />
        <MoveToBottomContainer>
          <ConditionButton condition={!!movePath}>
            <LightBgButton onClick={move}>Move</LightBgButton>
          </ConditionButton>
        </MoveToBottomContainer>
      </MoveToContainer>
    </MenuOverlay>
  );
};
