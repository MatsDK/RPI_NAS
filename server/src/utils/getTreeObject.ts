import fs from "fs";
import fsPath from "path";
import { TreeItem } from "../modules/Tree/TreeItem";

export const getTreeObject = (
  path: string,
  depth: number,
  checkPath: boolean = false
): null | TreeItem[] => {
  if (checkPath) {
    const thisPathstats = fs.lstatSync(path);
    if (!thisPathstats.isDirectory()) return null;
  }

  if (!depth) return null;

  const items: TreeItem[] = [];

  for (const currPath of fs.readdirSync(path)) {
    const thisPath = fsPath.join(path, currPath);
    const stats = fs.lstatSync(thisPath);

    const item = new TreeItem(stats.isDirectory() ? depth - 1 : 0, thisPath);

    item.name = currPath;
    item.size = stats.size;
    item.path = thisPath;
    item.isDirectory = stats.isDirectory();

    items.push(item);
  }

  return items;
};
