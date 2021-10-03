import { DeletePtahsMutation } from "graphql/Folder/deletePaths";
import { CopyToWrapper } from "./CopyMove/CopyToWrapper";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useRouter } from "next/dist/client/router";
import React, { useContext, useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { BgButton, Button, ConditionButton } from "src/ui/Button";
import styled from "styled-components";
import { SSHDownloadDropdown } from "./SSHDownloadDropdown";
import UploadWrapper from "./UploadWrapper";

const FolderNavbarWrapper = styled.div`
  height: 50px;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  margin: 5px 10px 0 10px;
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
`;

const FolderNavbar = () => {
  const { mutate } = useApollo();
  const router = useRouter();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSSHDownloadDropdown, setShowSSHDownloadDropdown] = useState(false);
  const [showCopyToForm, setShowCopyToForm] = useState(false);

  useEffect(() => {
    setShowSSHDownloadDropdown(false);
  }, [folderCtx]);

  const createDownloadSession = async (): Promise<void> => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

    if (!router.query.d) return;

    if (!selected.length) return;

    const { data } = await mutate(createSessionMutation, {
      data: selected.map(({ isDirectory, relativePath }) => ({
        path: relativePath,
        type: isDirectory ? "directory" : "file",
      })),
      type: "http",
      dataStoreId: Number(router.query.d),
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

  const deleteSelected = async () => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

    if (!router.query.d) return;

    if (!selected.length) return;

    const { data, errors } = await mutate(
      DeletePtahsMutation,
      {
        paths: selected.map(({ isDirectory, relativePath }) => ({
          path: relativePath,
          type: isDirectory ? "directory" : "file",
        })),

        dataStoreId: Number(router.query.d),
      },
      {
        refetchQueries: [
          {
            query: getTreeQuery,
            variables: {
              depth: 1,
              dataStoreId: folderCtx.currentFolderPath?.folderPath.dataStoreId,
              path: folderCtx.currentFolderPath?.folderPath.path,
            },
          },
          // {
          //   query: getDirectoryTreeQuery,
          //   variables: {
          //     depth: 1,
          //     dataStoreId: folderCtx.currentFolderPath?.folderPath.dataStoreId,
          //     path: folderCtx.currentFolderPath?.folderPath.path,
          //   },
          // },
        ],
      }
    );

    if (errors) return console.log(errors);

    folderCtx.selected.setSelected?.(new Map());

    console.log(data);
  };

  return (
    <FolderNavbarWrapper>
      {showUploadForm && (
        <UploadWrapper hide={() => setShowUploadForm(false)} />
      )}
      {showCopyToForm && (
        <CopyToWrapper hide={() => setShowCopyToForm(false)} />
      )}
      <BgButton
        onClick={() => {
          folderCtx?.newFolderInput?.setShowNewFolderInput((s) => !s);
        }}
      >
        New Folder
      </BgButton>
      <Button
        onClick={() => setShowUploadForm((showUploadForm) => !showUploadForm)}
      >
        Upload
      </Button>
      <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
        <Button onClick={() => createDownloadSession()}>Download</Button>
      </ConditionButton>
      <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
        <Button onClick={() => setShowSSHDownloadDropdown((s) => !s)}>
          Download SSH
        </Button>
        {showSSHDownloadDropdown && (
          <SSHDownloadDropdown
            close={() => setShowSSHDownloadDropdown(false)}
          />
        )}
      </ConditionButton>
      <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
        <Button onClick={deleteSelected}>Delete</Button>
      </ConditionButton>
      <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
        <Button onClick={() => {}}>Move To</Button>
      </ConditionButton>
      <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
        <Button onClick={() => setShowCopyToForm((s) => !s)}>Copy To</Button>
      </ConditionButton>
    </FolderNavbarWrapper>
  );
};

export default FolderNavbar;
