import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import fs from "fs";
import fsPath from "path";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { MyContext } from "../../types";
import { CreateDataStoreInput } from "./CreateDataStoreInput";
import { nanoid } from "nanoid";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { CreateSharedDataStoreInput } from "./CreateSharedDataStoreInput";
import { isAdmin } from "../../middleware/isAdmin";
import { createDatastoreFolder } from "../../utils/dataStore/createDatastoreFolder"

@Resolver()
export class DataStoreResolver {
  @UseMiddleware(isAuth, isAdmin)
  @Mutation(() => Datastore, { nullable: true })
  async createDataStore(
    @Ctx() { req }: MyContext,
    @Arg("data") { localNodeId, name, ownerId, sizeInMB }: CreateDataStoreInput
  ): Promise<Datastore | null> {
    const hostNode = await Node.findOne({ where: { hostNode: true } }),
      thisNode = await Node.findOne({ where: { id: localNodeId } });

    if (!hostNode || !thisNode) return null;

    const path = fsPath.join(thisNode.basePath, nanoid(10))
    createDatastoreFolder(path, sizeInMB).then(res => {
	    console.log(res)
    })

    return Datastore.create({
      basePath: path,
      userId: ownerId,
      localHostNodeId: hostNode.id,
      localNodeId,
      sizeInMB,
      name,
    }).save();
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async createSharedDataStore(
    @Arg("data") { ids }: CreateSharedDataStoreInput,
    @Ctx() { req }: MyContext
  ): Promise<boolean | null> {
    const { userId } = req as any,
      dataStoreIds: Set<number> = new Set();

    ids.forEach((i) => dataStoreIds.add(i.dataStoreId));

    for (const dataStoreId of dataStoreIds) {
      const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
      if (!dataStore || dataStore.userId != userId) return null;
    }

    await SharedDataStore.insert(ids);

    return true;
  }

  @UseMiddleware(isAuth, isAdmin)
  @Query(() => [Node], { nullable: true })
  getNodes() {
    return Node.find();
  }
}
