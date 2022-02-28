import { MiddlewareFn } from "type-graphql";
import { Node } from "../entity/CloudNode";
import { Datastore } from "../entity/Datastore";
import { MyContext } from "../types/Context";

export const getDatastoreAndNode: MiddlewareFn<MyContext> = async (
  { context: { req }, args },
  next
) => {
  const datastore = await Datastore.findOne({
    where: { id: args.data.datastoreId },
  });

  (req as any).datastore = datastore;

  datastore &&
    ((req as any).localNode = await Node.findOne({
      where: { id: datastore.localNodeId },
    }));

  return datastore && (req as any).localNode ? next() : null;
};
