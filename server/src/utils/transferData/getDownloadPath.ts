import archiver from "archiver";
import fs from "fs-extra";
import fsPath from "path";
import { TMP_FOLDER } from "../../constants";
import { DownloadSessionInput } from "../../modules/TransferData/DownloadSessionInput";

export const getDownloadPath = async (
  session: DownloadSessionInput,
  sessionId: string
): Promise<string | { err: any }> => {
  if (
    session.downloadPaths.length === 1 &&
    session.downloadPaths[0].type === "file"
  )
    return session.downloadPaths[0].path;

  const folderName = `${TMP_FOLDER}/${sessionId}`;

  fs.mkdirSync(folderName);

  for (const item of session.downloadPaths) {
    if (item.type === "file")
      fs.copyFileSync(item.path, `${folderName}/${fsPath.basename(item.path)}`);
    else fs.copySync(item.path, `${folderName}/${fsPath.basename(item.path)}`);
  }

  const output = fs.createWriteStream(`${folderName}.zip`),
    archive = archiver("zip", {
      zlib: { level: 9 },
    });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") console.log(err);
    else return { err };
  });

  archive.on("error", (err) => {
    return { err };
  });

  archive.pipe(output);

  archive.directory(folderName, `${sessionId}`);

  await archive.finalize();

  await new Promise((res, rej) => {
    output.on("close", () => {
      res("");
    });
  });

  fs.removeSync(folderName);

  return `${folderName}.zip`;
};
