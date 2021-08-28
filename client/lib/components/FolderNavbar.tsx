import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { FolderContext, FolderContextType } from "lib/providers/folderState";
import React, { useContext, useState } from "react";
import { useApolloClient } from "react-apollo";
import UploadWrapper from "./UploadWrapper";

const FolderNavbar = () => {
  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [showUploadForm, setShowUploadForm] = useState(false);

  const createDownloadSession = async (): Promise<void> => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

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
      {showUploadForm && <UploadWrapper />}
      <button onClick={() => createDownloadSession()}>Download</button>
      <button
        onClick={() => setShowUploadForm((showUploadForm) => !showUploadForm)}
      >
        Upload
      </button>
    </div>
  );
};

export default FolderNavbar;
