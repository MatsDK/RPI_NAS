const df = require("node-df");
import { Any } from "typeorm";
import { Datastore, SizeObject } from "../../entity/Datastore";
import { User } from "../../entity/User";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { dfOptions } from "../../constants";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";

export const getDatastoresWithSizesAndSharedUsers = async (
  datastores: Datastore[],
  userId: number,
  getSMBData: boolean = false
) => {
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

  sharedDataStores.forEach(async (sharedDatastore) => {
    let thisUser = users.find(({ id }) => id === sharedDatastore.userId);

    if (thisUser) {
      if (getSMBData) {
        const datastore = datastores.find(
          (ds) => ds.id === sharedDatastore.dataStoreId
        );

        if (datastore)
          thisUser.smbEnabled = datastore.allowedSMBUsers.includes(thisUser.id);
      }

      sharedUsersMap.set(sharedDatastore.dataStoreId, [
        ...(sharedUsersMap.get(sharedDatastore.dataStoreId) || []),
        thisUser,
      ]);
    }
  });

  return await getDataStoreSizes(
    await Promise.all(
      datastores.map(async (datastore) => {
        const owner = users.find(({ id }) => id === datastore.userId)!;

        return {
          ...datastore,
          sharedUsers: sharedUsersMap.get(datastore.id) || [],
          owner: {
            ...owner,
            smbEnabled: !!(await DatastoreService.findOne({
              where: {
                serviceName: ServiceNames.SMB,
                datastoreId: datastore.id,
                userId: owner.id,
              },
            })),
          },
        } as Datastore;
      })
    )
  );
};

const getDataStoreSizes = (dataStores: Datastore[]): Promise<Datastore[]> =>
  new Promise((res, rej) => {
    df(dfOptions, (err: any, r: any) => {
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
