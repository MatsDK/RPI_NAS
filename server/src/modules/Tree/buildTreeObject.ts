import { ApolloError } from "apollo-server-core";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { hasAccessToDatastore } from "../../utils/dataStore/hasAccessToDatastore";
import { Tree } from "./TreeObject";

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
    console.log("get remote tree")
  }

  return await new Tree(node.initializedUsers.includes(userId)).init(path, depth, datastore.basePath, directoryTree);
};
