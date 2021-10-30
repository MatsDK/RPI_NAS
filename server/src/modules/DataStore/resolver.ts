import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Any } from "typeorm"
import fsPath from "path";
import { User } from "../../entity/User";
import { Node } from "../../entity/CloudNode";
import { DatastoreService } from "../../entity/DatastoreService";
import { Datastore, DataStoreStatus } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { MyContext } from "../../types/Context";
import { CreateDataStoreInput } from "./CreateDataStoreInput";
import { nanoid } from "nanoid";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { CreateSharedDataStoreInput } from "./CreateSharedDataStoreInput";
import { isAdmin } from "../../middleware/isAdmin";
import { createDatastoreFolder } from "../../utils/dataStore/createDatastoreFolder";
import {
  createGroup,
  addUsersToGroup,
} from "../../utils/dataStore/handleGroups";
import { getDatastoresWithSizesAndSharedUsers } from "../../utils/dataStore/getDatastoresWithSizesAndSharedUsers";
import { toggleService } from "../../utils/services/toggleService";
import { UpdateDatastoreInput } from "./UpdateDatastoreInput";

@Resolver()
export class DataStoreResolver {
  @UseMiddleware(isAuth, getUser, isAdmin)
  @Mutation(() => Datastore, { nullable: true })
  async createDataStore(
    @Arg("data") { localNodeId, name, ownerId, sizeInMB }: CreateDataStoreInput
  ): Promise<Datastore | null> {
    const hostNode = await Node.findOne({ where: { hostNode: true } }),
      thisNode = await Node.findOne({ where: { id: localNodeId } }),
      owner = await User.findOne({ where: { id: ownerId } });

    if (!hostNode || !thisNode || !owner) return null;

    const path = fsPath.join(thisNode.basePath, nanoid(10));

    const newDatastore = await Datastore.create({
      basePath: path,
      userId: ownerId,
      localHostNodeId: hostNode.id,
      localNodeId,
      sizeInMB,
      name: name.replace(/[^a-z0-9]/gi, "_"),
      allowedSMBUsers: [ownerId],
    }).save();
    const groupName = fsPath.basename(path);

    const { err } = await createGroup(groupName, owner.osUserName);
    if (err) console.log(err);

    createDatastoreFolder(path, sizeInMB, {
      folderUser: thisNode.loginName,
      folderGroup: groupName,
    }).then(async (res) => {
      newDatastore &&
        (await Datastore.update(
          { id: newDatastore.id },
          { status: DataStoreStatus.ONLINE }
        ));
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
      const dataStore = await Datastore.findOne({
        where: { id: dataStoreId },
      });
      if (!dataStore || dataStore.userId != userId) return null;
    }

    await SharedDataStore.insert(ids);

    const { err } = await addUsersToGroup(ids);
    if (err) {
      console.log(err);
      return null;
    }

    return true;
  }

  @UseMiddleware(isAuth, isAdmin)
  @Query(() => [Node], { nullable: true })
  getNodes() {
    return Node.find();
  }

  @UseMiddleware(isAuth)
  @Query(() => Datastore, { nullable: true })
  async getDatastore(
    @Ctx() { req }: MyContext,
    @Arg("datastoreId") datastoreId: number
  ) {
    const datastore = await Datastore.findOne({
      where: { id: datastoreId },
    });

    return datastore?.userId === req.userId
      ? (
          await getDatastoresWithSizesAndSharedUsers(
            [datastore],
            req.userId!,
            true
          )
        )[0]
      : null;
  }

  @UseMiddleware(isAuth, getUser)
  @Mutation(() => Boolean, { nullable: true })
  async toggleDatastoreService(
    @Ctx() { req }: MyContext,
    @Arg("dataStoreId") datastoreId: number,
    @Arg("serviceName", () => String) serviceName: "SMB" | "FTP"
  ): Promise<boolean | null> {
    const datastore = await Datastore.findOne({
      where: { id: datastoreId },
    });
    if (
      !datastore ||
      req.userId !== datastore.userId ||
      datastore.status !== DataStoreStatus.ONLINE
    )
      return null;

    const host = await Node.findOne({
      where: { id: datastore.localNodeId },
    });
    if (!host) return null;

    return await toggleService({
      serviceName,
      host,
      datastore,
      userId: req.userId,
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async updateDatastore(
    @Ctx() { req }: MyContext,
    @Arg("dataStoreId") datastoreId: number,
    @Arg("updateProps") updateProps: UpdateDatastoreInput
  ): Promise<boolean | null> {
    const datastore = await Datastore.findOne({
      where: { id: datastoreId, userId: req.userId },
    });
    if (!datastore) return null;

    let updateSMB = false;

    const sharedDatastoreUsers = await SharedDataStore.find({
      where: { dataStoreId: datastoreId },
    });

    if(updateProps.sharedusers) {
	const newSharedUsers = updateProps.sharedusers?.filter(
		(userId) => !sharedDatastoreUsers.find((u) => u.userId == userId)
		),
		removedSharedUsers = sharedDatastoreUsers.filter(
		({ userId }) => !updateProps.sharedusers?.includes(userId)
		);

	if(newSharedUsers.length)
	      await SharedDataStore.insert(newSharedUsers.map((id) => ({userId: id, dataStoreId: datastoreId})));

	if(removedSharedUsers.length) {
	      await SharedDataStore.delete({ id : Any(removedSharedUsers.map(({ id }) => id)) })

	      const deleteServices = await DatastoreService.delete({ datastoreId, userId: Any(removedSharedUsers.map(({ id }) => id)) })
	      if(deleteServices.affected) updateSMB = true
	}
    }


    if (updateProps.name != null) {
      const newName = updateProps.name.replace(/[^a-z0-9]/gi, "_");
      newName != datastore.name && (datastore.name = newName);
    }

    console.log(datastore, updateSMB);

    return true;
  }
}
