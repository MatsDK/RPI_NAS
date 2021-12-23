import { DeletePtahsMutation } from "graphql/Folder/deletePaths";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useRouter } from "next/dist/client/router";
import React, { useContext, useRef, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useDropdown } from "src/hooks/useDropdown";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { BgButton, Button, ConditionButton } from "src/ui/Button";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import { CopyToWrapper } from "./CopyMove/CopyToWrapper";
import { MoveToWrapper } from "./CopyMove/MoveToWrapper";
import {
  SSHDownloadDropdown,
  SSHDownloadDropdownWrapper,
} from "./SSHDownloadDropdown";
import UploadWrapper from "./upload/UploadWrapper";

const FolderNavbarWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FolderNavBarContainer = styled.div`
  ${Scrollbar}

  height: 50px;
  overflow-y: hidden;
  overflow-x: auto;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  width: calc(100% - 20px);
`;

const FolderNavBarButtons = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

const SearchButton = styled.div`
  opacity: .75;
  cursor: pointer;
  transition: .15s ease-in-out;

  :hover {
    opacity: 1;
  }
`

const FolderNavbar = () => {
  const { mutate } = useApollo();
  const router = useRouter();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const downloadDropdown: any = useRef();
  useDropdown(
    downloadDropdown,
    () => showSSHDownloadDropdown && setShowSSHDownloadDropdown(false)
  );

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSSHDownloadDropdown, setShowSSHDownloadDropdown] = useState(false);
  const [showCopyToForm, setShowCopyToForm] = useState(false);
  const [showMoveToForm, setShowMoveToForm] = useState(false);

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
        ],
      }
    );

    if (errors) return console.log(errors);

    folderCtx.selected.setSelected?.(new Map());

    console.log(data);
  };

  return (
    <FolderNavBarContainer>
      <FolderNavbarWrapper>
        <FolderNavBarButtons>
          {showUploadForm && (
            <UploadWrapper hide={() => setShowUploadForm(false)} />
          )}
          {showCopyToForm && (
            <CopyToWrapper hide={() => setShowCopyToForm(false)} />
          )}
          {showMoveToForm && (
            <MoveToWrapper hide={() => setShowMoveToForm(false)} />
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
              <SSHDownloadDropdownWrapper ref={downloadDropdown}>
                <SSHDownloadDropdown
                  close={() => setShowSSHDownloadDropdown(false)}
                />
              </SSHDownloadDropdownWrapper>
            )}
          </ConditionButton>
          <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
            <Button onClick={deleteSelected}>Delete</Button>
          </ConditionButton>
          <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
            <Button onClick={() => setShowMoveToForm((s) => !s)}>Move To</Button>
          </ConditionButton>
          <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
            <Button onClick={() => setShowCopyToForm((s) => !s)}>Copy To</Button>
          </ConditionButton>
        </FolderNavBarButtons>
        <SearchButton>
          <Icon name="searchIcon" width={20} height={20} color={{ idx: 1, propName: "textColors" }} />
        </SearchButton>
      </FolderNavbarWrapper>
    </FolderNavBarContainer>
  );
};

export default FolderNavbar;
