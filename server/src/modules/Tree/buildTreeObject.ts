import { ApolloError } from "apollo-server-core";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { hasAccessToDatastore } from "../../utils/dataStore/hasAccessToDatastore";
import { getOrCreateNodeClient } from "../../utils/nodes/nodeClients";
import { GetTreeQuery } from "./GetTreeQuery";
import { Tree } from "./TreeObject";
import fsPath from "path";

interface Params {
  datastoreId: number | null;
  path: string;
  depth: number;
  userId: number;
  directoryTree: boolean;
}

export const buildTreeObject = async ({
  datastoreId,
  path,
  depth = 1,
  userId,
  directoryTree,
}: Params): Promise<Tree> => {
  if (datastoreId == null)
    return await new Tree(true).init(path, depth, null, directoryTree, { userId });

  const datastore = await Datastore.findOne({ where: { id: datastoreId } });
  if (!datastore) throw new ApolloError("datastore not found");

  if (!(await hasAccessToDatastore(datastore.id, userId, datastore.userId))) throw new ApolloError("No access allowed")

  const node = await Node.findOne({ where: { id: datastore.localNodeId } })
  if (!node) throw new ApolloError("Node not found")

  if (!node.hostNode) {
    const client = await getOrCreateNodeClient({ node, ping: false })
    if (!client) throw new ApolloError("Could not connect to client")

    const { data, errors } = await client.conn.query({
      query: GetTreeQuery,
      variables: {
        path: fsPath.join(datastore.basePath, path),
        basePath: datastore.basePath,
        depth,
        directoryTree
      }
    })

    if (errors) {
      console.log(errors)
      throw new ApolloError("Error occured")
    }

    return { ...data.queryTree, path, userInitialized: node.initializedUsers.includes(userId) } as Tree
  }

  return await new Tree(node.initializedUsers.includes(userId)).init(path, depth, datastore.basePath, directoryTree);
};
