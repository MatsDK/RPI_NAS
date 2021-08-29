import axios from "axios";
import { FolderContext, FolderContextType } from "lib/providers/folderState";
import React, { useContext, useEffect, useState } from "react";

const UploadWrapper = () => {
  const folderCtx: FolderContextType = useContext(FolderContext);

  const [folderPath, setFolderPath] = useState<string>(
    folderCtx?.currentFolderPath || "/"
  );
  const [path, setPath] = useState("H:/");
  const [folderData, setFolderData] = useState<
    Array<{ name: string; path: string; isDirectory: boolean }>
  >([]);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    updateUploadFolderView();
  }, [path]);

  const updateUploadFolderView = async () => {
    const { data, status } = await axios.get(`/api/path/${path}`);

    if (status === 200) setFolderData(data.data);
  };

  const upload = async () => {
    console.log(folderPath);
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
                  (selectedPaths) => new Set(selectedPaths.add(item.path))
                );
              } else {
                selectedPaths.delete(item.path);
                setSelectedPaths((selectedPaths) => new Set(selectedPaths));
              }
            }}
          >
            {selectedPaths.has(item.path) ? "remove" : "select"}
          </button>
        </div>
      ))}
      <h1>selected</h1>
      {Array.from(selectedPaths).map((path, idx) => (
        <div key={idx}>{path}</div>
      ))}
      <button onClick={upload}>Upload</button>
    </div>
  );
};

export default UploadWrapper;
