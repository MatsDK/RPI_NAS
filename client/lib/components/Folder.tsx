import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import { useApolloClient } from "react-apollo";
import React, { useContext } from "react";
import FolderItem from "./FolderItem";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { SelectedContext } from "lib/providers/selected";

interface Props {
  path: string;
}

const Folder: React.FC<Props> = ({ path }) => {
  const client: any = useApolloClient();

  const selectedCtx = useContext(SelectedContext);

  const { data, error, loading } = useGetTreeQueryQuery({
    variables: {
      depth: 1,
      path,
    },
    client,
  });

  if (loading) return <div>Loading</div>;

  if (error) return <div>error</div>;

  if (!data?.tree?.tree) return <div>folder not found</div>;

  const createDownloadSession = async (): Promise<void> => {
    if (!selectedCtx) return;

    const selected = Array.from(selectedCtx.selected).map(([_, v]) => v);

    const { data } = await (
      client as ApolloClient<NormalizedCacheObject>
    ).mutate({
      mutation: createSessionMutation,
      variables: {
        data: selected.map(({ isDirectory, relativePath }) => ({
          path: relativePath,
          type: isDirectory ? "directory" : "file",
        })),
      },
    });

    const sessionId = data?.createDownloadSession;
    if (!sessionId) return;

    window
      ?.open(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/download?s=${sessionId}`,
        "_blank"
      )
      ?.focus();
  };

  return (
    <div>
      <button onClick={() => createDownloadSession()}>Download</button>
      {data.tree.tree.map((item, idx) => (
        <FolderItem item={item as TreeItem} key={idx} />
      ))}
    </div>
  );
};

export default Folder;
