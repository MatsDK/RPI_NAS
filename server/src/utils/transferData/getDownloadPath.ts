import { DownloadSessionInput } from "../../modules/TransferData/DownloadSessionInput";
import fs from "fs-extra";
import archiver from "archiver";
import fsPath from "path";

export const getDownloadPath = async (
  session: DownloadSessionInput[],
  sessionId: string
): Promise<string | { err: any }> => {
  if (session.length === 1 && session[0].type === "file")
    return session[0].path;

  const folderName = `${__dirname}/${sessionId}`;

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
      res("done");
    });
  });

  return `${folderName}.zip`;
};
