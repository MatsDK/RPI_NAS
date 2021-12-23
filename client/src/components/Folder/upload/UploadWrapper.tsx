import axios from "axios";
import { LightBgButton } from "src/ui/Button";
import { getDataStoresQuery } from "graphql/DataStores/getDataStores";
import { ConditionButton } from "src/ui/Button";
import { createUploadSessionMutation } from "graphql/TransferData/createUploadSession";
import { useRouter } from "next/dist/client/router";
import fsPath from "path";
import React, { useContext, useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApollo";
import { useInput } from "src/hooks/useInput";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import { Select } from "src/ui/Select";
import styled from "styled-components";
import { LabelInput } from "../../../ui/Input";
import MenuOverlay from "../../MenuOverlay";
import { FolderPath } from "./FolderPath";

interface Props {
  hide: () => any;
}

type FolderData = Array<{ name: string; path: string; isDirectory: boolean }>;
type SelectedPaths = Map<string, { isDir: boolean }>;

type DataStoreType = { name: string; id: number };

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 27px;
  color: ${(props) => props.theme.textColors[3]};
  border-bottom: 1px solid ${(props) => props.theme.bgColors[1]};
  padding-bottom: 10px;
  margin-bottom: 5px;
`;

const SelectedItems = styled.p`
  color: ${(props) => props.theme.textColors[2]};
  margin-left: 10px;
  font-size: 14px;
`;

const DestinationInput = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;

  > div {
    display: flex;
  }
`;

const PathWrapper = styled.div`
  margin-top: 10px;
  > div {
    display: flex;
  }
`;

const SmallTitle = styled.span`
  color: ${(props) => props.theme.textColors[3]};
  font-size: 18px;
  font-weight: 500;
`;

const SelectedPathsContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme.bgColors[1]};
  min-height: 150px;
  display: flex;
  flex-direction: column;
  max-height: 250px;
  margin-bottom: 10px;
`;

const SelectedPaths = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 5px;

  ${Scrollbar}
`;

const FolderItem = styled.div`
  display: flex;
  padding: 2px 0;

  input[type="checkbox"] {
    opacity: 0;
    transition: 0.15s ease-in-out;
  }

  :hover input[type="checkbox"] {
    opacity: 1;
  }

  input[type="checkbox"]:checked {
    opacity: 1;
  }
`;

const ContentContainer = styled.div`
  ${Scrollbar}

  flex: 1;
  padding-top: 10px;
  overflow: auto;
`;

const RemoveButton = styled.div`
  margin-bottom: 2px;
  margin-right: 5px;
  cursor: pointer;
  padding: 1px 5px;
`;

const SelectedItem = styled.div`
  display: flex;
  align-items: center;

  > div {
    opacity: 0;
    transition: 0.15s ease-in-out;
  }

  :hover > div {
    opacity: 1;
  }
`;

const UploadWrapper: React.FC<Props> = ({ hide }) => {
  const { query, mutate } = useApollo();
  const router = useRouter();

  const dataStoreId = router.query.d;

  if (!dataStoreId) return null;

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderPath, setFolderPath] = useInput<string>(
    folderCtx?.currentFolderPath?.folderPath.path || ""
  );
  const [path, setPath] = useState<null | string>(null);
  const [drives, setDrives] = useState<string[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [folderData, setFolderData] = useState<FolderData>([]);
  const [selectedPaths, setSelectedPaths] = useState<SelectedPaths>(new Map());
  const [dataStores, setDataStores] = useState<DataStoreType[]>([]);
  const [selectedDataStore, setSelectedDataStore] = useState<null | {
    id: any;
    name: string;
  }>(null);

  useEffect(() => {
    updateUploadFolderView();
  }, [path, selectedDrive]);

  useEffect(() => {
    setPath("/");
  }, [selectedDrive]);

  useEffect(() => {
    axios.get("/api/getdrives").then((res) => {
      setDrives(res.data.drives.map((d: any) => d.mountpoints[0].path));
      if (!selectedDrive)
        setSelectedDrive(res.data.drives[0]?.mountpoints[0].path || null);
    });

    query(getDataStoresQuery, {}).then(({ data, errors }) => {
      if (errors) return console.log(errors);

      setDataStores(
        data.getDataStores.map(({ id, name }) => ({ id: Number(id), name }))
      );
    });
  }, []);

  const updateUploadFolderView = async () => {
    if (!selectedDrive) return;

    const { data, status } = await axios.get(
      `/api/path/${fsPath.join(selectedDrive.replace(/\\/g, "/"), path || "")}`
    );

    if (status === 200) setFolderData(data.data);
  };

  const upload = async () => {
    const data = Array.from(selectedPaths),
      newData: Array<{ path: string; isDir: boolean }> = [];

    if (!data.length) return;

    for (const path of data) {
      let addValue = true;

      data.forEach((p) => {
        if (path.includes(p[0]) && path !== p) addValue = false;
      });

      if (addValue) newData.push({ path: path[0], isDir: path[1].isDir });
    }

    const {
      data: {
        createUploadSession: { uploadPath, ...connectionData },
      },
    } = await mutate(createUploadSessionMutation, {
      uploadPath: folderPath,
      dataStoreId: selectedDataStore!.id,
    });

    const res = await axios.get(`/api/upload`, {
      params: {
        data: {
          connectionData,
          uploadPath,
          uploadData: newData,
        },
      },
    });

    console.log(res.data);
  };

  const selectItem = (item: {
    name: string;
    path: string;
    isDirectory: boolean;
  }) => {
    if (!selectedPaths.has(item.path)) {
      setSelectedPaths(
        (selectedPaths) =>
          new Map(
            selectedPaths.set(item.path, {
              isDir: item.isDirectory,
            })
          )
      );
    } else {
      selectedPaths.delete(item.path);
      setSelectedPaths((selectedPaths) => new Map(selectedPaths));
    }
  };

  return (
    <MenuOverlay hide={hide}>
      <Container>
        <Title>Upload</Title>
        <DestinationInput>
          <SmallTitle>Upload to</SmallTitle>
          <div>
            <Select
              data={[
                ...dataStores,
                {
                  name: folderCtx?.currentFolderPath?.folderPath.dataStoreName,
                  id: folderCtx?.currentFolderPath?.folderPath.dataStoreId,
                },
              ]}
              label={"DataStore"}
              setValue={setSelectedDataStore}
            />
            <div
              style={{ marginLeft: 20, display: "flex", alignItems: "center" }}
            >
              <LabelInput
                value={folderPath}
                label={"Path"}
                setValue={setFolderPath}
              />
            </div>
          </div>
        </DestinationInput>

        <PathWrapper>
          <SmallTitle>Path</SmallTitle>
          <div>
            <Select
              data={drives}
              label="Drive"
              setValue={setSelectedDrive}
            />
            <FolderPath
              setPath={setPath}
              path={path}
              selectedDrive={selectedDrive}
            />
          </div>
        </PathWrapper>
        <ContentContainer>
          {folderData
            .sort((a, b) => (b.isDirectory as any) - (a.isDirectory as any))
            .map((item, idx) => (
              <FolderItem
                key={idx}
                style={{
                  cursor: item.isDirectory ? "pointer" : "default",
                  width: "fit-content",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={"checkbox"}
                  style={{
                    marginTop: 3,
                    marginRight: 10,
                    outline: 0,
                  }}
                  checked={selectedPaths.has(item.path)}
                  onClick={() => selectItem(item)}
                />
                <div
                  style={{ display: "flex" }}
                  onClick={() =>
                    item.isDirectory
                      ? selectedDrive &&
                      setPath(
                        fsPath.relative(
                          selectedDrive.replace(/\\/g, "/"),
                          item.path.replace(/\\/g, "/")
                        )
                      )
                      : selectItem(item)
                  }
                >
                  <div style={{ marginRight: 7 }}>
                    {item.isDirectory ? (
                      <Icon
                        name={"folderIcon"}
                        color={{ idx: 2, propName: "lightBgColors" }}
                        width={19}
                        viewPort={22}
                        height={19}
                      />
                    ) : (
                      <Icon
                        name={"fileIcon"}
                        viewPort={23}
                        color={{ idx: 2, propName: "lightBgColors" }}
                        width={19}
                        height={19}
                      />
                    )}
                  </div>

                  {item.name}
                </div>
              </FolderItem>
            ))}
        </ContentContainer>
        <SelectedPathsContainer>
          <div
            style={{ display: "flex", alignItems: "baseline", marginTop: 4 }}
          >
            <SmallTitle>selected</SmallTitle>
            <SelectedItems>{selectedPaths.size} selected</SelectedItems>
          </div>
          <SelectedPaths>
            {Array.from(selectedPaths).map((path, idx) => (
              <SelectedItem key={idx}>
                <RemoveButton
                  onClick={() => {
                    selectedPaths.delete(path[0]);
                    setSelectedPaths((selectedPaths) => new Map(selectedPaths));
                  }}
                >
                  <Icon
                    name={"removeIcon"}
                    viewPort={20}
                    color={{ idx: 2, propName: "lightBgColors" }}
                    width={19}
                    height={19}
                  />
                </RemoveButton>
                <span>{path[0]}</span>
              </SelectedItem>
            ))}
          </SelectedPaths>
        </SelectedPathsContainer>
        <ConditionButton
          condition={!!selectedPaths.size && !!selectedDataStore}
        >
          <LightBgButton onClick={upload}>Upload</LightBgButton>
        </ConditionButton>
      </Container>
    </MenuOverlay>
  );
};

export default UploadWrapper;

