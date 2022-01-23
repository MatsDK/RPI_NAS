import { Any } from "typeorm";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { User } from "../../entity/User";
import { getDatastoreSizes } from "./getDatastoresSizes";

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


  const nodes = await Node.find({ where: { id: Any(datastores.map(({ localNodeId }) => localNodeId)) } })

  datastores = await getDatastoresSharedUsersAndOwner(datastores, { users, sharedUsersMap })
  datastores = await getDatastoreSizes(datastores, nodes)
  datastores = getDatastoreInitializedStatus(datastores, { nodes, userId })

  return datastores;
};

interface GetDatastoreInitializedStatusProps {
  nodes: Node[]
  userId: number
}

const getDatastoreInitializedStatus = (datastores: Datastore[], { nodes, userId }: GetDatastoreInitializedStatusProps) => {
  for (const ds of datastores) {
    const node = nodes.find(({ id }) => id === ds.localNodeId)
    if (!node) continue

    ds.userInitialized = node.initializedUsers.includes(userId)
  }

  return datastores
}

interface GetDatastoreSharedUsersAndOwnerProps {
  users: User[]
  sharedUsersMap: Map<number, User[]>
}

const getDatastoresSharedUsersAndOwner = async (datastores: Datastore[], { users, sharedUsersMap, }: GetDatastoreSharedUsersAndOwnerProps) => {
  const ownerDatastoreServicesSMB = await DatastoreService.find({
    where: {
      serviceName: ServiceNames.SMB,
      datastoreId: Any(datastores.map(({ id }) => id)),
      userId: Any(users.map(({ id }) => id)),
    },
  });

  return datastores.map((datastore) => {
    const owner = users.find(({ id }) => id === datastore.userId)!;

    return {
      ...datastore,
      sharedUsers: sharedUsersMap.get(datastore.id) || [],
      owner: {
        ...owner,
        smbEnabled: !!ownerDatastoreServicesSMB.find(
          (s) =>
            s.datastoreId === datastore.id &&
            s.userId === owner.id &&
            s.serviceName === ServiceNames.SMB
        ),
      },
    } as Datastore;
  })
}
