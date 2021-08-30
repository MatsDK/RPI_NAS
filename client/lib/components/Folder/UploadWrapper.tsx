import { useApolloClient } from "react-apollo";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import axios from "axios";
import { createUploadSessionMutation } from "graphql/TransferData/createUploadSession";
import { FolderContext, FolderContextType } from "lib/providers/folderState";
import React, { useContext, useEffect, useState } from "react";

const UploadWrapper = () => {
  const client: any = useApolloClient();

  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderPath, setFolderPath] = useState<string>(
    folderCtx?.currentFolderPath || "/"
  );
  const [path, setPath] = useState("H:/");
  const [folderData, setFolderData] = useState<
    Array<{ name: string; path: string; isDirectory: boolean }>
  >([]);
  const [selectedPaths, setSelectedPaths] = useState<
    Map<string, { isDir: boolean }>
  >(new Map());

  useEffect(() => {
    updateUploadFolderView();
  }, [path]);

  const updateUploadFolderView = async () => {
    const { data, status } = await axios.get(`/api/path/${path}`);

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
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        height: "100vh",
        minWidth: "35vw",
        borderLeft: "1px solid black",
      }}
    >
      <h1>upload</h1>
      <input
        type="text"
        placeholder="upload location"
        value={folderPath}
        onChange={(e) => setFolderPath(e.target.value)}
      />
      <div style={{ display: "flex" }}>
        {path.split(`/`).map((x, idx) => (
          <div
            onClick={() => {
              const newPath = path
                .split("/")
                .slice(0, idx + 1)
                .join("/");

              setPath(newPath);
            }}
            key={idx}
          >
            {x}/
          </div>
        ))}
      </div>
      {folderData.map((item, idx) => (
        <div key={idx} style={{ display: "flex" }}>
          {item.isDirectory ? (
            <p
              style={{ cursor: "pointer", width: "fit-content" }}
              onClick={() => setPath(item.path.replace(/\\/g, "/"))}
            >
              {item.name}
            </p>
          ) : (
            <p style={{ width: "fit-content" }}>{item.name}</p>
          )}

          <button
            onClick={() => {
              if (!selectedPaths.has(item.path)) {
                setSelectedPaths(
                  (selectedPaths) =>
                    new Map(
                      selectedPaths.set(item.path, { isDir: item.isDirectory })
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
    </div>
  );
};

export default UploadWrapper;
