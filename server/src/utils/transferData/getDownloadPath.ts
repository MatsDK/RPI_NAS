import archiver from "archiver";
import fs from "fs-extra";
import fsPath from "path";
import { TMP_FOLDER } from "../../constants";
import { DownloadPathsInput } from "../../modules/TransferData/DownloadSessionInput";

export const getDownloadPath = async (
  session: DownloadPathsInput[],
  sessionId: string
): Promise<{ path: string, deleteTmpFolder: boolean, err?: any }> => {
  if (session.length === 1 && session[0].type === "file")
    return { path: session[0].path, deleteTmpFolder: false }

  const folderName = `${TMP_FOLDER}/${sessionId}`;

  fs.mkdirSync(folderName);

  for (const item of session) {
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

    output.on("error", (e) => rej(e));
  });

  fs.removeSync(folderName);

  return { path: `${folderName}.zip`, deleteTmpFolder: true }
};