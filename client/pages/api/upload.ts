import type { NextApiRequest, NextApiResponse } from "next";
import fsPath from "path";
import { Client } from "ssh-package/dist";
import { paths } from "./download";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { connectionData, uploadPath, uploadData } = JSON.parse(
    req.query.data as string
  );

  const timeout = new Promise((res) =>
    setTimeout(() => {
      res({ err: "connection timed out" });
    }, 4000)
  );

  console.log(connectionData, uploadData, uploadPath)

  const getData = new Promise((res, rej) => {
    const client = new Client({
      host: connectionData.hostIp,
      ...connectionData,
    });

    client.on("ready", async () => {
      const uploadFiles: paths = [],
        uploadDirs: paths = [];

      for (const { path, isDir } of uploadData) {
        const baseName = fsPath.basename(path),
          newPath = fsPath.join(uploadPath, baseName);

        if (isDir) uploadDirs.push({ local: path, remote: newPath });
        else uploadFiles.push({ local: path, remote: newPath });
      }

      await client.upload.files(uploadFiles);
      await client.upload.directories(uploadDirs);

      return res({ err: false });
    });

    client.on("timeout", () => {
      return rej({ err: "connection timed out" });
    });
  });

  const response = await Promise.race([getData, timeout]);
  console.log(response)
  res.status(200).json(response);
};
