import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { LoadingOverlay } from "src/ui/Button";
import { MoveDataMutation } from "graphql/Folder/moveData";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import React, { useContext, useState } from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext } from "src/providers/folderState";
import { Button, ConditionButton, BgButton } from "src/ui/Button";
import { MoveCopyPath, Tree } from "./Tree";
import { Container, Title, Wrapper, BottomContainer } from "../../../ui/CopyAndMove"

interface MoveToWrapperProps {
  hide: () => any;
}

export const MoveToWrapper: React.FC<MoveToWrapperProps> = ({ hide }) => {
  const { mutate } = useApollo();
  const client: any = useApolloClient();

  const [movePath, setMovePath] = useState<null | MoveCopyPath>(null);

  const folderCtx = useContext(FolderContext);

  const { data, error } = useGetDirectoryTreeQueryQuery({
    client,
    variables: { depth: 1, path: "/" },
  });

  if (error) console.log(error);

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
        dataStoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
        destination: movePath,
      },
      {
        refetchQueries: [
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              datastoreId: movePath?.datastoreId,
              path: movePath?.path,
            },
          },
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
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
    <Wrapper>
      <Container>
        <Title>Move To</Title>
        <Tree
          data={data}
          setSelectedPath={setMovePath}
          selectedPath={movePath}
        />
        <BottomContainer>
          <p>
            To:{" "}
            <span>
              {
                data?.directoryTree?.tree?.find(
                  (v) => v.dataStoreId == movePath?.datastoreId
                )?.name
              }
              /{movePath?.path.replace(/\\/g, "/")}
            </span>
          </p>
          <div>
            <Button onClick={hide}>Cancel</Button>
            <LoadingOverlay loading={true}>
              <ConditionButton condition={!!movePath}>
                <BgButton onClick={move}>Move</BgButton>
              </ConditionButton>
            </LoadingOverlay>
          </div>
        </BottomContainer>
      </Container>
    </Wrapper>
  );
};
