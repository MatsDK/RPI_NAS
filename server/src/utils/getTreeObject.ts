import fs from "fs";
import fsPath from "path";
import { TreeItem } from "../modules/Tree/TreeItem";

interface GetTreeOptions {
  checkPath?: boolean;
  directoryTree: boolean;
  basePath: string;
}

export const getTreeObject = (
  path: string,
  depth: number,
  { checkPath = false, directoryTree, basePath }: GetTreeOptions
): null | TreeItem[] => {
  path = fsPath.join(basePath, path);

  try {
    if (checkPath) {
      const thisPathstats = fs.lstatSync(path);
      if (!thisPathstats.isDirectory()) return null;
    }
  } catch (e) {
    console.log(e)
    return []
  }

  if (!depth) return null;

  const items: TreeItem[] = [];

  let data = []
  try {
    data = fs.readdirSync(path)
  } catch (e) {
    return []
  }

  for (const currPath of data) {
    try {
      const thisPath = fsPath.join(path, currPath);
      const stats = fs.lstatSync(thisPath);

      if (directoryTree && !stats.isDirectory()) continue;

      const item = new TreeItem(
        stats.isDirectory() ? depth - 1 : 0,
        thisPath,
        directoryTree,
        basePath
      );

      item.name = currPath;
      item.size = stats.size;
      item.relativePath = fsPath.relative(basePath, thisPath);
      item.isDirectory = stats.isDirectory();

      items.push(item);
    } catch (error) {
      console.log(error)
    }
  }

  return items || [];
};