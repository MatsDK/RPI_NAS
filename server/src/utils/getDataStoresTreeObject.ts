import { TreeItem } from "../modules/Tree/TreeItem";
import fsPath from "path";
import { Datastore } from "../entity/Datastore";

export const getDataStoresTreeObject = async (
  userOptions: any,
  depth: number,
  path: string,
  directoryTree: boolean
): Promise<TreeItem[]> => {
  const { userId } = userOptions;

  const userDataStores = await Datastore.find({ where: { userId } }),
    items: TreeItem[] = [];

  for (const { basePath, name, id } of userDataStores) {
    const newItem = new TreeItem(
      depth,
      fsPath.join(basePath, path),
      directoryTree,
      basePath
    );

    newItem.name = name;
    newItem.path = basePath;
    newItem.relativePath = "";
    newItem.isDirectory = true;
    newItem.dataStoreId = id;

    items.push(newItem);
  }

  return items;
};
