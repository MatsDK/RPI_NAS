import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import fs from "fs";
import fsPath from "path";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { MyContext } from "../../types";
import { CreateDataStoreInput } from "./CreateDataStoreInput";
import { nanoid } from "nanoid";

@Resolver()
export class DataStoreResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Datastore, { nullable: true })
  async createDataStore(
    @Ctx() { req }: MyContext,
    @Arg("data") { localNodeId, name }: CreateDataStoreInput
  ): Promise<Datastore | null> {
    const hostNode = await Node.findOne({ where: { hostNode: true } }),
      thisNode = await Node.findOne({ where: { id: localNodeId } });

    if (!hostNode || !thisNode) return null;

    const path = fsPath.join(thisNode.basePath, nanoid(10));
    try {
      fs.mkdirSync(path);
    } catch (error) {
      console.log(error);
      return null;
    }

    return Datastore.create({
      basePath: path,
      userId: (req as any).userId,
      localHostNodeId: hostNode.id,
      localNodeId,
      name,
    }).save();
  }
}
