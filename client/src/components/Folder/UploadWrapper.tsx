import { useApolloClient } from "react-apollo";
import { LabelInput } from "../../ui/Input";
import { Select } from "src/ui/Select";
import fsPath from "path";
import MenuOverlay from "../MenuOverlay";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import axios from "axios";
import { createUploadSessionMutation } from "graphql/TransferData/createUploadSession";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import React, { useContext, useEffect, useState } from "react";
import { useInput } from "src/hooks/useInput";
import { useRouter } from "next/dist/client/router";
import styled from "styled-components";

interface Props {
  hide: () => any;
}

type FolderData = Array<{ name: string; path: string; isDirectory: boolean }>;
type SelectedPaths = Map<string, { isDir: boolean }>;

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
  const client: any = useApolloClient();
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
    } = await (client as ApolloClient<NormalizedCacheObject>).mutate({
      mutation: createUploadSessionMutation,
      variables: {
        uploadPath: folderPath,
        dataStoreId: Number(dataStoreId),
      },
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
              data={[{ name: "val1" }, { name: "val2" }]}
              propName={"name"}
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
              selectedIdx={0}
              label="Drive"
              setValue={setSelectedDrive}
            />
            <div style={{ display: "flex" }}>
              {selectedDrive &&
                path?.split("/")[0] &&
                (path || "").split(`/`).map((x, idx) => (
                  <div
                    onClick={() => {
                      const newPath = (path || "")
                        .split("/")
                        .slice(0, idx)
                        .join("/");

                      setPath(newPath);
                    }}
                    key={idx}
                  >
                    {x}/
                  </div>
                ))}
            </div>
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

export default UploadWrapper;
