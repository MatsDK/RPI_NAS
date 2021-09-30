import axios from "axios";
import { getDataStoresQuery } from "graphql/DataStores/getDataStores";
import { createUploadSessionMutation } from "graphql/TransferData/createUploadSession";
import { useRouter } from "next/dist/client/router";
import fsPath from "path";
import React, { useContext, useEffect, useState } from "react";
import { useApollo } from "src/hooks/useApolloMutation";
import { useInput } from "src/hooks/useInput";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Icon from "src/ui/Icon";
import { Select } from "src/ui/Select";
import styled from "styled-components";
import { LabelInput } from "../../ui/Input";
import MenuOverlay from "../MenuOverlay";

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
  font-weight: bold;
  font-size: 36px;
  color: ${(props) => props.theme.textColors[3]};
  border-bottom: 1px solid ${(props) => props.theme.bgColors[1]};
  padding-bottom: 10px;
  margin-bottom: 5px;
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
    console.log(selectedDataStore);

    const data = Array.from(selectedPaths),
      newData: Array<{ path: string; isDir: boolean }> = [];

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
      dataStoreId: Number(dataStoreId),
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
              selectedIdx={dataStores.findIndex(
                (v) =>
                  v.id == folderCtx?.currentFolderPath?.folderPath.dataStoreId
              )}
              propName={"name"}
              label={"DataStore"}
              minWidth={200}
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
              selectedIdx={0}
              label="Drive"
              minWidth={40}
              setValue={setSelectedDrive}
            />
            <FolderPath
              setPath={setPath}
              path={path}
              selectedDrive={selectedDrive}
            />
          </div>
        </PathWrapper>
        <div style={{ flex: 1, overflow: "auto" }}>
          {folderData.map((item, idx) => (
            <div key={idx} style={{ display: "flex" }}>
              {item.isDirectory ? (
                <p
                  style={{ cursor: "pointer", width: "fit-content" }}
                  onClick={() => {
                    selectedDrive &&
                      setPath(
                        fsPath.relative(
                          selectedDrive.replace(/\\/g, "/"),
                          item.path.replace(/\\/g, "/")
                        )
                      );
                  }}
                >
                  dir {item.name}
                </p>
              ) : (
                <p style={{ width: "fit-content" }}>file {item.name}</p>
              )}

              <button
                onClick={() => {
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
                }}
              >
                {selectedPaths.has(item.path) ? "remove" : "select"}
              </button>
            </div>
          ))}
        </div>
        <h1>selected</h1>
        {Array.from(selectedPaths).map((path, idx) => (
          <div key={idx}>
            {path[0]}
            <button
              onClick={() => {
                selectedPaths.delete(path[0]);
                setSelectedPaths((selectedPaths) => new Map(selectedPaths));
              }}
            >
              remove
            </button>
          </div>
        ))}
        <button onClick={upload}>Upload</button>
      </Container>
    </MenuOverlay>
  );
};

interface PathItemProps {
  clickable: boolean;
}

const PathItem = styled.span<PathItemProps>`
  display: flex;
  align-items: center;
  margin-right: 3px;
  color: ${(props) => props.theme.textColors[3]};

  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

  font-weight: ${(props) => (props.clickable ? "400" : "600")};
`;

const GoToRootButton = styled.div`
  svg {
    transform: scale(1.3);
    margin-right: 14px;
    cursor: pointer;
    margin-bottom: 2px;
  }
`;

interface PathWrapperProps {
  selectedDrive: null | string;
  path: string | null;
  setPath: React.Dispatch<React.SetStateAction<string | null>>;
}

const FolderPath: React.FC<PathWrapperProps> = ({
  selectedDrive,
  path,
  setPath,
}) => {
  if (!path || !path.split("/")[0] || selectedDrive == null) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
      <GoToRootButton onClick={() => setPath("/")}>
        <Icon
          name={"doubleArrow"}
          color={{ idx: 2, propName: "textColors" }}
          viewPort={20}
          height={16}
          width={16}
        />
      </GoToRootButton>
      {path.split("/").length > 2
        ? path
            .split("/")
            .slice(path.split("/").length - 2)
            .map((x, idx) => (
              <PathItem
                clickable={idx != 1}
                onClick={() =>
                  setPath(
                    path
                      .split("/")
                      .slice(0, path.split("/").length - 1)
                      .join("/")
                  )
                }
                key={idx}
              >
                {x}
                {idx != 1 ? (
                  <Icon
                    name={"folderArrow"}
                    color={{ idx: 2, propName: "textColors" }}
                    height={16}
                    width={16}
                  />
                ) : (
                  ""
                )}
              </PathItem>
            ))
        : path.split(`/`).map((x, idx) => (
            <PathItem
              clickable={idx != path.split("/").length - 1}
              onClick={() => {
                const newPath = (path || "")
                  .split("/")
                  .slice(0, idx + 1)
                  .join("/");

                setPath(newPath);
              }}
              key={idx}
            >
              {x}
              {idx != path.split("/").length - 1 ? (
                <Icon
                  name={"folderArrow"}
                  color={{ idx: 2, propName: "textColors" }}
                  height={16}
                  width={16}
                />
              ) : (
                ""
              )}
            </PathItem>
          ))}
    </div>
  );
};

export default UploadWrapper;
