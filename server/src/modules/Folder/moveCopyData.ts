import { Datastore } from "../../entity/Datastore";
import fs from "fs-extra";
import fsPath from "path";
import { CopyMoveInput } from "./copyMoveMutationInput";

export const MoveCopyData = async ({
  data,
  dataStoreId,
  destination,
  type,
}: CopyMoveInput & { type: "copy" | "move" }) => {
  const dataStores: Map<number, Datastore> = new Map();
  console.log(data);

  const thisDataStore = await Datastore.find({
    where: [{ id: dataStoreId }, { id: destination.dataStoreId }],
  });

  thisDataStore.forEach((v) => dataStores.set(v.id, v));

  const ds = dataStores.get(dataStoreId),
    destDs = dataStores.get(destination.dataStoreId);

  if (!ds || !destDs) return null;

  for (const { path } of data) {
    const fromPath = fsPath.join(ds.basePath, path),
      toPath = fsPath.join(
        destDs.basePath,
        destination.path,
        fsPath.basename(path)
      );

    try {
      type === "move"
        ? fs.moveSync(fromPath, toPath)
        : fs.copySync(fromPath, toPath, { recursive: true });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return true;
};
