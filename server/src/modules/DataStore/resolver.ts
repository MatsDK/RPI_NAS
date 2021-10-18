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
import { Datastore, DataStoreStatus } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { MyContext } from "../../types/Context";
import { CreateDataStoreInput } from "./CreateDataStoreInput";
import { nanoid } from "nanoid";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { CreateSharedDataStoreInput } from "./CreateSharedDataStoreInput";
import { isAdmin } from "../../middleware/isAdmin";
import { createDatastoreFolder } from "../../utils/dataStore/createDatastoreFolder";
import { updateSMB } from "../../utils/dataStore/updateSMB"

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

    const path = fsPath.join(thisNode.basePath, nanoid(10));

    const newDatastore = await Datastore.create({
      basePath: path,
      userId: ownerId,
      localHostNodeId: hostNode.id,
      localNodeId,
      sizeInMB,
      name,
    }).save();

    createDatastoreFolder(path, sizeInMB).then(async (res) => {
      console.log("update");
      newDatastore &&
        (await Datastore.update(
          { id: newDatastore.id },
          { status: DataStoreStatus.ONLINE }
        ));
      console.log("online");
    });

    return newDatastore;
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


  //@UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async enableSMB(
    @Arg("dataStoreId") datastoreId: number,
  ): Promise<boolean | null> {
	  const datastore = await Datastore.findOne({where: { id: datastoreId }})
	  if(!datastore || datastore.status != DataStoreStatus.ONLINE) return null

	  datastore.smbEnabled = !datastore.smbEnabled
	  datastore.status = DataStoreStatus.INIT
	  await datastore.save()

	  updateSMB().then(async (res: any) => {
	        datastore.status = DataStoreStatus.ONLINE


		if(res.err) {
			  datastore.smbEnabled = !datastore.smbEnabled
			  console.log(res.err)
	       	}

		await datastore.save()
	  })

	  return true;
  }
}
