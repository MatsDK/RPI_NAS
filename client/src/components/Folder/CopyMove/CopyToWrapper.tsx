import { useGetDirectoryTreeQueryQuery } from "generated/apolloComponents";
import { LoadingOverlay } from "src/ui/Button";
import { Title, Wrapper, Container, BottomContainer } from "../../../ui/CopyAndMove"
import { CopyDataMutation } from "graphql/Folder/copyData";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import React, { useContext, useState } from "react";
import { useApolloClient } from "react-apollo";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext } from "src/providers/folderState";
import { BgButton, Button, ConditionButton } from "src/ui/Button";
import { MoveCopyPath, Tree } from "./Tree";

interface CopyToWrapperProps {
  hide: () => any;
}
export const CopyToWrapper: React.FC<CopyToWrapperProps> = ({ hide }) => {
  const { mutate } = useApollo();
  const client: any = useApolloClient();

  const [copyToPath, setCopyToPath] = useState<null | MoveCopyPath>(null);
  const [loading, setLoading] = useState(false)

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

    try {
      setLoading(true)
      const { errors, data } = await mutate(
        CopyDataMutation,
        {
          data: selectedData,
          datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
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
      setLoading(false)

      if (errors) return console.log(errors);

      if (data.copy) hide();
    } catch (e) {
      setLoading(false)
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>Copy To</Title>
        <Tree
          data={data}
          setSelectedPath={setCopyToPath}
          selectedPath={copyToPath}
        />
        <BottomContainer>
          <p>
            To:
            <span>
              {
                data?.directoryTree?.tree?.find(
                  (v) => v.datastoreId == copyToPath?.datastoreId
                )?.name
              }
              /{copyToPath?.path.replace(/\\/g, "/")}
            </span>
          </p>
          <div>
            <Button onClick={hide}>Cancel</Button>
            <LoadingOverlay loading={loading}>
              <ConditionButton condition={!!copyToPath}>
                <BgButton onClick={copy}>Copy</BgButton>
              </ConditionButton>
            </LoadingOverlay>
          </div>
        </BottomContainer>
      </Container>
    </Wrapper>
  );
};
