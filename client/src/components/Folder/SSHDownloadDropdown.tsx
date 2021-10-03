import axios from "axios";
import { createSessionMutation } from "graphql/TransferData/createDownloadSession";
import { setDefaultDownloadPathMutation } from "graphql/User/setDefaultDownloadPath";
import router from "next/router";
import React, { useContext } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useInput } from "src/hooks/useInput";
import { useMeState } from "src/hooks/useMeState";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { ConditionButton, LightButton } from "src/ui/Button";
import { LabelInput } from "src/ui/Input";
import styled from "styled-components";

interface SSHDownloadDropdownProps {
  close: () => any;
}

const Wrapper = styled.div`
  position: absolute;
  padding: 4px 10px 6px 10px;
  box-shadow: 3px 3px 10px 3px #00000042;
  border-radius: 3px;
  background-color: ${(props) => props.theme.bgColors[2]};

  h1 {
    padding-bottom: 10px;
    font-size: 25px;
    color: ${(props) => props.theme.textColors[3]};
  }
`;

export const SSHDownloadDropdown: React.FC<SSHDownloadDropdownProps> = ({
  close,
}) => {
  const { me } = useMeState();

  const folderCtx: FolderContextType = useContext(FolderContext);
  const { mutate } = useApollo();

  const [pathInput, setPathInput] = useInput<string>(
    me.defaultDownloadPath || ""
  );

  const setDefaultPath = async () => {
    const { errors, data } = await mutate(setDefaultDownloadPathMutation, {
      path: pathInput.trim(),
    });

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

    const { data } = await mutate(createSessionMutation, {
      data: selected.map(({ isDirectory, relativePath }) => ({
        path: relativePath,
        type: isDirectory ? "directory" : "file",
      })),
      type: "SSH",
      dataStoreId: Number(router.query.d),
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

    if (res.data.err) console.log(res.data.err);

    close();
  };

  return (
    <Wrapper>
      <h1>Download</h1>
      <LabelInput label={"Path"} setValue={setPathInput} value={pathInput} />
      <div style={{ display: "flex" }}>
        <ConditionButton
          condition={
            !!pathInput.trim() && pathInput.trim() !== me.defaultDownloadPath
          }
        >
          <LightButton onClick={setDefaultPath}>Set as default</LightButton>
        </ConditionButton>
        <ConditionButton condition={!!pathInput.trim()}>
          <LightButton onClick={createSSHDownloadSession}>Download</LightButton>
        </ConditionButton>
      </div>
    </Wrapper>
  );
};
