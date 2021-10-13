import { MiddlewareFn } from "type-graphql";
import { Node } from "../entity/CloudNode";
import { Datastore } from "../entity/Datastore";
import { MyContext } from "../types/Context";

export const getDataStoreAndNode: MiddlewareFn<MyContext> = async (
  { context: { req }, args },
  next
) => {
  const dataStore = await Datastore.findOne({
    where: { id: args.data.dataStoreId },
  });

  (req as any).dataStore = dataStore;

  dataStore &&
    ((req as any).localNode = await Node.findOne({
      where: { id: dataStore.localNodeId },
    }));

  return dataStore && (req as any).localNode ? next() : null;
};
