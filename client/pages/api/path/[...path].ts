import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import fsPath from "path";

export default (req: NextApiRequest, res: NextApiResponse) => {
  let path = (req.query.path as string[]).join("/");
  if (!path.endsWith("/")) path += "/";

  const pathStats = fs.lstatSync(path);
  if (!pathStats.isDirectory()) return res.status(400);

  const returnArr: Array<{ path: string; isDirectory: boolean; name: string }> =
      [],
    folderData = fs.readdirSync(path);

  for (const folderItem of folderData) {
    const thisPath = fsPath.join(path, folderItem);

    try {
      const stats = fs.lstatSync(thisPath);

      returnArr.push({
        isDirectory: stats.isDirectory(),
        path: thisPath,
        name: folderItem,
      });
    } catch {}
  }

  res.status(200).json({ data: returnArr });
};
