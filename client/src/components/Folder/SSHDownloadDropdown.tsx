import axios from "axios";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { setDefaultDownloadPathMutation } from "graphql/User/setDefaultDownloadPath";
import { Spinner } from "src/ui/Spinner";
import router from "next/router";
import React, { useContext, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useInput } from "src/hooks/useInput";
import { useMeState } from "src/hooks/useMeState";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { BgButton, Button, ConditionButton } from "src/ui/Button";
import styled from "styled-components";
import { Input, Label } from "../../ui/Input";

interface SSHDownloadDropdownProps {
  close: () => any;
}

export const SSHDownloadDropdownWrapper = styled.div`
  position: absolute;
  padding: 4px 10px 6px 10px;
  box-shadow: 3px 3px 10px 3px #00000012;
  border: 1px solid ${(props) => props.theme.lightBgColors[2]};
  border-radius: 3px;
  background-color: ${(props) => props.theme.lightBgColors[0]};

  h1 {
    padding-bottom: 10px;
    font-size: 25px;
    font-weight: 600;
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const PathInput = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin-bottom: 10px;

  > label {
    margin-top: 0;
  }
`

export const SSHDownloadDropdown: React.FC<SSHDownloadDropdownProps> = ({
  close,
}) => {
  const { me } = useMeState();
  const folderCtx: FolderContextType = useContext(FolderContext);
  const { mutate } = useApollo();

  const [loading, setLoading] = useState(false)

  const [pathInput, setPathInput] = useInput<string>(
    me.defaultDownloadPath || ""
  );

  const setDefaultPath = async () => {
    if (!pathInput.trim()) return null

    setLoading(true)
    const { errors, data } = await mutate(setDefaultDownloadPathMutation, {
      path: pathInput.trim(),
    });
    setLoading(false)

    me.defaultDownloadPath = pathInput.trim();

    if (errors) {
      return console.log(errors);
    }

    console.log(data);
  };

  const createSSHDownloadSession = async (): Promise<void> => {
    if (!folderCtx) return;

    const selected = Array.from(folderCtx.selected.selectedItems).map(
      ([_, v]) => v
    );

    if (!router.query.d) return;

    setLoading(true)
    const { data } = await mutate(createSessionMutation, {
      data: selected.map(({ isDirectory, relativePath }) => ({
        path: relativePath,
        type: isDirectory ? "directory" : "file",
      })),
      type: "SSH",
      datastoreId: Number(router.query.d),
    });

    const { data: resData, hostIp, ...rest } = data.createDownloadSession;

    const res = await axios.get(`/api/download`, {
      params: {
        data: {
          downloadPath: pathInput.trim(),
          data: resData,
          hostIp,
          connectData: {
            ...rest,
            host: hostIp,
          },
        },
      },
    });
    setLoading(false)

    if (res.data.err) console.log(res.data.err);

    close();
  };

  return (
    <>
      <h1>Download SSH</h1>
      <PathInput>
        <Label>Path</Label>
        <Input
          type="text"
          placeholder="Download to"
          value={pathInput}
          onChange={setPathInput}
        />
      </PathInput>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Spinner loading={loading} />
        <ConditionButton
          condition={
            !loading &&
            !!pathInput.trim() && pathInput.trim() !== me.defaultDownloadPath
          }
        >
          <Button onClick={setDefaultPath}>Set as default</Button>
        </ConditionButton>
        <ConditionButton condition={!loading && !!pathInput.trim()}>
          <BgButton onClick={createSSHDownloadSession}>Download</BgButton>
        </ConditionButton>
      </div>
    </>
  );
};
