import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { Button, BgButton } from "src/ui/Button";
import axios from "axios";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import React, { useContext, useState } from "react";
import { useApolloClient } from "react-apollo";
import UploadWrapper from "./UploadWrapper";
import { useRouter } from "next/dist/client/router";
import styled from "styled-components";

const FolderNavbarWrapper = styled.div`
  height: 50px;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  margin: 5px 10px 0 10px;
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
`;

const FolderNavbar = () => {
  const client: any = useApolloClient();
  const router = useRouter();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [showUploadForm, setShowUploadForm] = useState(false);

  const createSSHDownloadSession = async (): Promise<void> => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

    if (!router.query.d) return;

    const { data } = await (
      client as ApolloClient<NormalizedCacheObject>
    ).mutate({
      mutation: createSessionMutation,
      variables: {
        data: selected.map(({ isDirectory, relativePath }) => ({
          path: relativePath,
          type: isDirectory ? "directory" : "file",
        })),
        type: "SSH",
        dataStoreId: Number(router.query.d),
      },
    });

    const { data: resData, hostIp, ...rest } = data.createDownloadSession;

    const res = await axios.get(`/api/download`, {
      params: {
        data: {
          downloadPath: "H:/sshTests",
          data: resData,
          hostIp,
          connectData: {
            ...rest,
            host: hostIp,
          },
        },
      },
    });

    if (res.data.err) console.log(res.data.err);
  };

  const createDownloadSession = async (): Promise<void> => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

    if (!router.query.d) return;

    if (!selected.length) return;

    const { data } = await (
      client as ApolloClient<NormalizedCacheObject>
    ).mutate({
      mutation: createSessionMutation,
      variables: {
        data: selected.map(({ isDirectory, relativePath }) => ({
          path: relativePath,
          type: isDirectory ? "directory" : "file",
        })),
        type: "http",
        dataStoreId: Number(router.query.d),
      },
    });

    const sessionId = data?.createDownloadSession?.id;
    if (!sessionId) return;

    window
      ?.open(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/download?s=${sessionId}`,
        "_blank"
      )
      ?.focus();
  };

  return (
    <FolderNavbarWrapper>
      {showUploadForm && (
        <UploadWrapper hide={() => setShowUploadForm(false)} />
      )}
      <BgButton
        onClick={() => {
          folderCtx?.newFolderInput?.setShowNewFolderInput((s) => !s);
        }}
      >
        New Folder
      </BgButton>
      <Button onClick={() => createDownloadSession()}>Download</Button>
      <Button
        onClick={() => setShowUploadForm((showUploadForm) => !showUploadForm)}
      >
        Upload
      </Button>
      <Button onClick={() => createSSHDownloadSession()}>Download SSH</Button>
    </FolderNavbarWrapper>
  );
};

export default FolderNavbar;
