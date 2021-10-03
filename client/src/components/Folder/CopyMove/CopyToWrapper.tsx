import { CopyDataMutation } from "graphql/Folder/copyData";
import { Tree } from "./Tree";
import React, { useContext, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext } from "src/providers/folderState";
import { ConditionButton, LightBgButton } from "src/ui/Button";
import styled from "styled-components";
import MenuOverlay from "../../MenuOverlay";
import { MoveCopyPath } from "./Tree";
import { getTreeQuery } from "graphql/TreeObject/queryTree";

interface CopyToWrapperProps {
  hide: () => any;
}

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

  const [copyToPath, setCopyToPath] = useState<null | MoveCopyPath>(null);

  const folderCtx = useContext(FolderContext);

  const copy = async () => {
    const selectedData = Array.from(
      folderCtx?.selected.selectedItems || []
    ).map(([_, v]) => ({
      path: v.relativePath,
      type: v.isDirectory ? "directory" : "file",
    }));

    if (!selectedData) return;

    const { errors, data } = await mutate(
      CopyDataMutation,
      {
        data: selectedData,
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
        destination: copyToPath,
      },
      {
        refetchQueries: [
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              dataStoreId: copyToPath?.dataStoreId,
              path: copyToPath?.path,
            },
          },
        ],
      }
    );

    if (errors) return console.log(errors);

    if (data.copy) hide();
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