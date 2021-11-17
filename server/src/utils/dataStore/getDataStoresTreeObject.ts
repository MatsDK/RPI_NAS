import { Any } from "typeorm";
import fsPath from "path";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { TreeItem } from "../../modules/Tree/TreeItem";
import { Datastore } from "../../entity/Datastore";
import { getUserDataStores } from "./getUserDataStores";

export const getDataStoresTreeObject = async (
  { userId }: { userId: number },
  depth: number,
  path: string,
  directoryTree: boolean
): Promise<TreeItem[]> => {
  const userDataStores: Datastore[] = await getUserDataStores(userId),
    items: TreeItem[] = [];

  const sharedDatastores = await SharedDataStore.find({
    where: { dataStoreId: Any(userDataStores.map(({ id }) => id)) },
  });
  for (const { basePath, name, id } of userDataStores) {
    const newItem = new TreeItem(
      depth,
      fsPath.join(basePath, path),
      directoryTree,
      basePath
    );

    const isShared = !!sharedDatastores.filter(
      ({ dataStoreId }) => dataStoreId === id
    ).length;

    newItem.name = name;
    newItem.path = basePath;
    newItem.dataStoreId = id;
    newItem.sharedDataStore = isShared;
    newItem.relativePath = "";
    newItem.isDirectory = true;

    items.push(newItem);
  }

  return items;
};
