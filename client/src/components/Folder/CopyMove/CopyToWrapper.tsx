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
import { useApolloClient } from "react-apollo";
import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { Scrollbar } from "src/ui/Scrollbar";

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
  display: flex;
  color: ${(props) => props.theme.textColors[2]};
  border-top: 1px solid ${(props) => props.theme.bgColors[1]};

  p {
    margin-left: 8px;
    display: flex;
    overflow: hidden;
  }

  span {
    flex: 1;
    color: ${(props) => props.theme.textColors[3]};
    overflow: auto;
    white-space: nowrap;
    ${Scrollbar}
  }
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 27px;
  color: ${(props) => props.theme.textColors[3]};
  border-bottom: 1px solid ${(props) => props.theme.bgColors[1]};
  padding-bottom: 10px;
  margin-bottom: 5px;
`;

export const CopyToWrapper: React.FC<CopyToWrapperProps> = ({ hide }) => {
  const { mutate } = useApollo();
  const client: any = useApolloClient();

  const [copyToPath, setCopyToPath] = useState<null | MoveCopyPath>(null);

  const folderCtx = useContext(FolderContext);

  const { data, error } = useGetDirectoryTreeQueryQuery({
    client,
    variables: { depth: 1, path: "/" },
  });

  if (error) console.log(error);

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
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
        destination: copyToPath,
      },
      {
        refetchQueries: [
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              datastoreId: copyToPath?.datastoreId,
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
        <Tree
          data={data}
          setSelectedPath={setCopyToPath}
          selectedPath={copyToPath}
        />
        <CopyToBottomContainer>
          <ConditionButton condition={!!copyToPath}>
            <LightBgButton onClick={copy}>Copy</LightBgButton>
          </ConditionButton>
          <p>
            To:{" "}
            <span>
              {
                data?.directoryTree?.tree?.find(
                  (v) => v.dataStoreId == copyToPath?.datastoreId
                )?.name
              }
              /{copyToPath?.path.replace(/\\/g, "/")}
            </span>
          </p>
        </CopyToBottomContainer>
      </CopyToContainer>
    </MenuOverlay>
  );
};
