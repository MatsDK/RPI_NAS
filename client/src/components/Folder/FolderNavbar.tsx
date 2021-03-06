import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { useRouter } from "next/dist/client/router";
import { Input } from "src/ui/Input";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useDropdown } from "src/hooks/useDropdown";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { BgButton, Button, ConditionButton } from "src/ui/Button";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import { CopyToWrapper } from "./CopyMove/CopyToWrapper";
import { MoveToWrapper } from "./CopyMove/MoveToWrapper";
import { DeleteDropdown } from "./DeleteDropdown";
import {
  SSHDownloadDropdown,
  SSHDownloadDropdownWrapper
} from "./SSHDownloadDropdown";
import { UploadWrapper } from "./upload/UploadWrapper";

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

const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: right;
  align-items: center;

  > input {
    margin-right: 10px;
  }
`

interface Props {
  setFilterInput: React.Dispatch<React.SetStateAction<string>>
  filterInput: string
}

const FolderNavbar: React.FC<Props> = ({ setFilterInput, filterInput }) => {
  const { mutate } = useApollo();
  const router = useRouter();

  const folderCtx: FolderContextType = useContext(FolderContext);

  useEffect(() => {
    setFilterInput("")
  }, [folderCtx?.currentFolderPath?.folderPath])

  const downloadDropdown: any = useRef();

  useDropdown(
    downloadDropdown,
    () => showSSHDownloadDropdown && setShowSSHDownloadDropdown(false)
  );

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSSHDownloadDropdown, setShowSSHDownloadDropdown] = useState(false);
  const [showDeleteDropdown, setShowDeleteDropdown] = useState(false);
  const [showCopyToForm, setShowCopyToForm] = useState(false);
  const [showMoveToForm, setShowMoveToForm] = useState(false);
  const [showFilterInput, setShowFilterInput] = useState(false);

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
      datastoreId: Number(router.query.d),
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
            <Button onClick={() => setShowDeleteDropdown(s => !s)}>Delete</Button>
            {showDeleteDropdown && <DeleteDropdown hide={() => setShowDeleteDropdown(false)} />}
          </ConditionButton>
          <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
            <Button onClick={() => setShowMoveToForm((s) => !s)}>Move To</Button>
          </ConditionButton>
          <ConditionButton condition={!!folderCtx?.selected.selectedItems.size}>
            <Button onClick={() => setShowCopyToForm((s) => !s)}>Copy To</Button>
          </ConditionButton>
        </FolderNavBarButtons>
        <SearchContainer>

          {showFilterInput &&
            <Input
              type="text"
              placeholder="filter"
              value={filterInput}
              onChange={(e) => setFilterInput(e.currentTarget.value.trim())}
            />
          }
          <SearchButton onClick={() => setShowFilterInput(s => !s)}>
            <Icon name="searchIcon" width={20} height={20} color={{ idx: 1, propName: "textColors" }} />
          </SearchButton>
        </SearchContainer>
      </FolderNavbarWrapper>
    </FolderNavBarContainer >
  );
};

export default FolderNavbar;
