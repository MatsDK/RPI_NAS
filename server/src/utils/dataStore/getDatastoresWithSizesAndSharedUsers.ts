const df = require("node-df");
import { Any } from "typeorm"
import { Datastore, SizeObject } from "../../entity/Datastore";
import { User } from "../../entity/User"
import { SharedDataStore } from "../../entity/SharedDataStore"

const options = { prefixMultiplier: "MiB", isDisplayPrefixMultiplier: false };

export const getDatastoresWithSizesAndSharedUsers = async (datastores: Datastore[], userId: number) => {
    const sharedDataStores = await SharedDataStore.find({
      where: {
        dataStoreId: Any(datastores.map((v) => v.id)),
      },
    });

    const users = await User.find({
      where: {
        id: Any(
          Array.from(
            new Set([
              userId,
              ...sharedDataStores.map(({ userId }) => userId),
              ...datastores.map(({ userId }) => userId),
            ])
          )
        ),
      },
    });

    const sharedUsersMap: Map<number, User[]> = new Map();

    sharedDataStores.forEach((sharedDatastore) => {
      const thisUser = users.find(({ id }) => id === sharedDatastore.userId);

      if (thisUser)
        sharedUsersMap.set(sharedDatastore.dataStoreId, [
          ...(sharedUsersMap.get(sharedDatastore.dataStoreId) || []),
          thisUser,
        ]);
    });

    return await getDataStoreSizes(datastores.map((datastore) => ({
      ...datastore,
      sharedUsers: sharedUsersMap.get(datastore.id) || [],
      owner: users.find(({ id }) => id === datastore.userId),
    })) as any);
}

const getDataStoreSizes = (
  dataStores: Datastore[]
): Promise<Datastore[]> =>
  new Promise((res, rej) => {
    df(options, (err: any, r: any) => {
      if (err) rej(err);

      for (const ds of dataStores) {
        const fs = r.find((f: any) => f.mount === ds.basePath);

        if (fs) {
          const sizeObj = new SizeObject();

          sizeObj.usedSize = Math.round(fs.used * 10) / 10;
          sizeObj.usedPercent = Math.round(fs.capacity * 100);

          ds.size = sizeObj;
        }
      }

      res(dataStores);
    });
  });
