import { Any } from "typeorm";
import fsPath from "path";
import { SharedDatastore } from "../../entity/SharedDatastore";
import { TreeItem } from "../../modules/Tree/TreeItem";
import { Datastore } from "../../entity/Datastore";
import { getUserDatastores } from "./getUserDatastores";

export const getDatastoresTreeObject = async (
  { userId }: { userId: number },
  depth: number,
  path: string,
  directoryTree: boolean
): Promise<TreeItem[]> => {
  const userDatastores: Datastore[] = await getUserDatastores(userId),
    items: TreeItem[] = [];

  const sharedDatastores = await SharedDatastore.find({
    where: { datastoreId: Any(userDatastores.map(({ id }) => id)) },
  });
  for (const { basePath, name, id } of userDatastores) {
    const newItem = new TreeItem(
      depth,
      fsPath.join(basePath, path),
      directoryTree,
      basePath
    );

    const isShared = !!sharedDatastores.filter(
      ({ datastoreId }) => datastoreId === id
    ).length;

    newItem.name = name;
    newItem.path = basePath;
    newItem.datastoreId = id;
    newItem.sharedDatastore = isShared;
    newItem.relativePath = "";
    newItem.isDirectory = true;

    items.push(newItem);
  }

  return items;
};
