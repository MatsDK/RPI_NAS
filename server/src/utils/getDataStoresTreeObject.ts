import { TreeItem } from "../modules/Tree/TreeItem";
import fsPath from "path";
import { Datastore } from "../entity/Datastore";
import { getConnection } from "typeorm";
import { SharedDataStore } from "../entity/SharedDataStore";

export const getDataStoresTreeObject = async (
  userOptions: any,
  depth: number,
  path: string,
  directoryTree: boolean
): Promise<TreeItem[]> => {
  const { userId } = userOptions;

  // SELECT * FROM datastore d LEFT JOIN shared_data_store s ON s."dataStoreId"=d.id
  // WHERE d."userId"=$1 OR s.id=$1
  const userDataStores = await getConnection()
      .getRepository(Datastore)
      .createQueryBuilder("d")
      .leftJoin("shared_data_store", "s", `s."dataStoreId"=d.id`)
      .where("d.userId=:id OR s.userId=:id", { id: userId })
      .getMany(),
    items: TreeItem[] = [];

  for (const { basePath, name, id } of userDataStores) {
    const newItem = new TreeItem(
      depth,
      fsPath.join(basePath, path),
      directoryTree,
      basePath
    );

    const isShared = !!(await SharedDataStore.count({
      where: { dataStoreId: id },
    }));

    newItem.name = name;
    newItem.path = basePath;
    newItem.dataStoreId = id;
    newItem.relativePath = "";
    newItem.isDirectory = true;
    newItem.sharedDataStore = isShared;

    items.push(newItem);
  }

  return items;
};
