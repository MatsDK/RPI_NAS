import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import fsPath from "path";
import { Client } from "ssh-package";

export type paths = Array<{ local: string; remote: string }>;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, connectData, downloadPath } = JSON.parse(
    req.query.data as string
  );

  if (!fs.existsSync(downloadPath) || !fs.lstatSync(downloadPath).isDirectory())
    return res.status(200).json({ err: `path "${downloadPath}" not found` });

  const timeout = new Promise((res) =>
    setTimeout(() => {
      res({ err: "connection timed out" });
    }, 4000)
  );

  const getData = new Promise((resolve, rej) => {
    const client = new Client(connectData);

    client.on("ready", async () => {
      const downloadFiles: paths = [],
        downloadDirs: paths = [];

      for (const { path, type } of data) {
        const baseName = fsPath.basename(path),
          newPathObj = {
            local: fsPath.join(downloadPath, baseName),
            remote: path,
          };

        if (type === "file") downloadFiles.push(newPathObj);
        else if (type === "directory") downloadDirs.push(newPathObj);
      }

      try {
        await client.download.files(downloadFiles);
        await client.download.directories(downloadDirs);

        return resolve({ err: false });
      } catch (error) {
        return rej({ err: error.message });
      }
    });

    client.on("timeout", () => {
      return rej({ err: "connection timed out" });
    });
  });

  const response = await Promise.race([getData, timeout]);
  res.status(200).json(response);
};
