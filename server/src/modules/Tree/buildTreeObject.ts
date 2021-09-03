import { Datastore } from "../../entity/Datastore";
import { Tree } from "./TreeObject";

interface Params {
  dataStoreId: number | null;
  path: string;
  depth: number;
  userId: number;
  directoryTree: boolean;
}

export const buildTreeObject = async ({
  dataStoreId,
  path,
  depth = 1,
  userId,
  directoryTree,
}: Params): Promise<Tree> => {
  if (dataStoreId == null)
    return await new Tree().init(path, depth, null, directoryTree, { userId });

  const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
  if (!dataStore) throw new Error("datastore not found");

  return await new Tree().init(path, depth, dataStore.basePath, directoryTree);
};
