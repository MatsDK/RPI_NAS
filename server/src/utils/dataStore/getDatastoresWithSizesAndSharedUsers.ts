const df = require("node-df");
import { Any } from "typeorm";
import { Datastore, SizeObject } from "../../entity/Datastore";
import { User } from "../../entity/User";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { dfOptions } from "../../constants";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { Node } from "../../entity/CloudNode"
import { getOrCreateNodeClient } from "../nodes/nodeClients";
import gql from "graphql-tag";

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

  const ownerDatastoreServicesSMB = await DatastoreService.find({
    where: {
      serviceName: ServiceNames.SMB,
      datastoreId: Any(datastores.map(({ id }) => id)),
      userId: Any(users.map(({ id }) => id)),
    },
  });

  datastores = datastores.map((datastore) => {
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

  return await getDatastoreSizes(
    datastores,
    await Node.find({ where: { id: Any(datastores.map(({ localNodeId }) => localNodeId)) } })
  );
};

const getLocalDatastoreSizes = (datastores: Datastore[]): Promise<Datastore[]> => new Promise((res, rej) => {
  df(dfOptions, (err: any, r: any) => {
    if (err) rej(err);

    for (const ds of datastores) {
      const fs = r.find((f: any) => f.mount === ds.basePath);

      if (fs) {
        const sizeObj = new SizeObject();

        sizeObj.usedSize = Math.round(fs.used * 10) / 10;
        sizeObj.usedPercent = Math.round(fs.capacity * 100);

        ds.size = sizeObj;
      }
    }

    res(datastores);
  });
})

const GET_REMOTE_DATASTORE_SIZES_QUERY = gql`
query GetDatastoreSizes($datastores: [GetDatastoreSizesInput!]!) {
  getDatastoresSizes(datastores: $datastores) {
    id
    path
    size {
      usedSize
      usedPercent
    }
  }
}
`

type GetDatastoreSizesReturnObj = { id: number, path: string, size: SizeObject }

const getRemoteDatastoreSizes = async (datastores: Datastore[], node: Node): Promise<Datastore[]> => {
  try {
    const client = await getOrCreateNodeClient({ node, ping: false })
    if (!client) return []

    const { data } = await client.conn.query({
      query: GET_REMOTE_DATASTORE_SIZES_QUERY,
      variables: { datastores: datastores.map(({ id, basePath }) => ({ id, path: basePath })) }
    })

    return datastores.map((ds) => ({
      ...ds,
      size: (data.getDatastoresSizes as GetDatastoreSizesReturnObj[]).find(({ id }) => id === ds.id)?.size
    }) as Datastore)
  } catch (e) {
    console.log(e)
    return []
  }
}

const getDatastoreSizes = async (datastores: Datastore[], nodes: Node[]): Promise<Datastore[]> => {
  let ret: Datastore[] = []

  for (const node of nodes) {
    const nodeDatastores = datastores.filter(({ localNodeId }) => node.id === localNodeId)

    ret = [
      ...ret,
      ...(node.hostNode ? await getLocalDatastoreSizes(nodeDatastores) : await getRemoteDatastoreSizes(nodeDatastores, node))
    ]
  }

  return ret
}

