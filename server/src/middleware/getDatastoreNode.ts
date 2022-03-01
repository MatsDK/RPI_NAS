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

  req.datastore = datastore;

  datastore &&
    (req.localNode = await Node.findOne({
      where: { id: datastore.localNodeId },
    }));

  return datastore && req.localNode ? next() : null;
};
