import { ApolloError } from "apollo-server-core";
import { nanoid } from "nanoid";
import fsPath from "path";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware
} from "type-graphql";
import { Node } from "../../entity/CloudNode";
import { Datastore, DatastoreStatus } from "../../entity/Datastore";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { SharedDatastore } from "../../entity/SharedDatastore";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { isAdmin } from "../../middleware/isAdmin";
import { MyContext } from "../../types/Context";
import { createDatastoreFolder } from "../../utils/datastore/createDatastoreFolder";
import { getDatastoresWithSizesAndSharedUsers } from "../../utils/datastore/getDatastoresWithSizesAndSharedUsers";
import { getUserDatastores } from "../../utils/datastore/getUserDatastores";
import { addUsersToGroup, createGroup } from "../../utils/datastore/handleGroups";
import { hasAccessToDatastore } from "../../utils/datastore/hasAccessToDatastore";
import { updateDatastoreOwnerAndName, updateSharedUsers, updateSharedUsersServices } from "../../utils/datastore/updateDatastore";
import { createRemoteDatastore } from "../../utils/nodes/createDatastore";
import { toggleService } from "../../utils/services/toggleService";
import { updateSMB } from "../../utils/services/updateSMB";
import { CreateDatastoreInput } from "./CreateDataStoreInput";
import { CreateSharedDatastoreInput } from "./CreateSharedDataStoreInput";
import { UpdateDatastoreInput } from "./UpdateDatastoreInput";

@Resolver()
export class DatastoreResolver {
	@UseMiddleware(isAuth, getUser)
	@Query(() => [Datastore], { nullable: true })
	async getDatastores(@Ctx() { req }: MyContext): Promise<Datastore[]> {
		const datastores = await (req.user?.isAdmin
			? Datastore.find()
			: getUserDatastores(req.userId));

		return await getDatastoresWithSizesAndSharedUsers(datastores, req.userId!);
	}

	@UseMiddleware(isAuth, getUser, isAdmin)
	@Mutation(() => Datastore, { nullable: true })
	async createDatastore(
		@Arg("data") data: CreateDatastoreInput
	): Promise<Datastore | null> {
		const { localNodeId, name, ownerId, sizeInMB, ownerPassword } = data

		const hostNode = await Node.findOne({ where: { hostNode: true } }),
			thisNode = await Node.findOne({ where: { id: localNodeId } }),
			owner = await User.findOne({ where: { id: ownerId } });

		if (!hostNode || !thisNode || !owner) return null;

		const basePath = fsPath.join(thisNode.basePath, nanoid(10)),
			groupName = fsPath.basename(basePath);

		const newDatastore = await Datastore.create({
			basePath,
			userId: ownerId,
			localHostNodeId: hostNode.id,
			localNodeId,
			sizeInMB,
			name: name.replace(/[^a-z0-9]/gi, "_"),
			allowedSMBUsers: [ownerId],
		}).save();

		const isUserInitialized = thisNode.initializedUsers.includes(ownerId)
		if (!isUserInitialized && !ownerPassword?.trim()) {
			Datastore.delete({ id: newDatastore.id })
			throw new Error("User not initialized")
		}

		const setStatusToOnline = async () => newDatastore && await Datastore.update({ id: newDatastore.id }, { status: DatastoreStatus.ONLINE })

		if (hostNode.id != thisNode.id) {
			const { err } = await createRemoteDatastore({
				node: thisNode,
				path: basePath,
				groupName,
				sizeInMB,
				ownerUserName: owner.osUserName,
				ownerPassword,
				initOwner: !isUserInitialized
			})

			if (err) {
				console.log(err)
				throw new Error(err)
				return null
			}

			await setStatusToOnline()
			thisNode.initializedUsers = [...new Set([...thisNode.initializedUsers, ownerId])]
			await thisNode.save()

		} else {
			const { err } = await createGroup(groupName, owner.osUserName);
			if (err) {
				console.log(err)
			};

			createDatastoreFolder(basePath, sizeInMB, {
				folderUser: thisNode.loginName,
				folderGroup: groupName,
			}).then(async () => await setStatusToOnline());
		}

		return newDatastore;
	}

	@UseMiddleware(isAuth)
	@Mutation(() => Boolean, { nullable: true })
	async createSharedDatastore(
		@Arg("data") { ids }: CreateSharedDatastoreInput,
		@Ctx() { req }: MyContext
	): Promise<boolean | null> {
		const { userId } = req as any,
			datastoreIds: Set<number> = new Set();

		ids.forEach((i) => datastoreIds.add(i.datastoreId));

		for (const datastoreId of datastoreIds) {
			const datastore = await Datastore.findOne({
				where: { id: datastoreId },
			});
			if (!datastore || datastore.userId != userId) return null;
		}

		await SharedDatastore.insert(ids);

		const { err } = await addUsersToGroup(ids);
		if (err) {
			console.log(err);
			return null;
		}

		return true;
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
		if (!datastore) return null;

		const isDatastoreOwner = datastore?.userId === req.userId;

		if (!(await hasAccessToDatastore(datastoreId, req.userId, datastore.userId))) throw new ApolloError("No access allowed")

		const ret = (
			await getDatastoresWithSizesAndSharedUsers(
				[datastore],
				req.userId!,
				isDatastoreOwner
			)
		)[0];

		if (!isDatastoreOwner) {
			const sharedUser = ret.sharedUsers?.find(({ id }) => id == req.userId);
			sharedUser &&
				(sharedUser.smbEnabled = !!(await DatastoreService.findOne({
					where: {
						userId: req.userId,
						datastoreId,
						serviceName: ServiceNames.SMB,
					},
				})));
		}

		return ret;
	}

	@UseMiddleware(isAuth, getUser)
	@Mutation(() => Boolean, { nullable: true })
	async toggleDatastoreService(
		@Ctx() { req }: MyContext,
		@Arg("datastoreId") datastoreId: number,
		@Arg("serviceName", () => String) serviceName: "SMB" | "FTP"
	): Promise<boolean | null> {
		const datastore = await Datastore.findOne({
			where: { id: datastoreId },
		});
		if (!datastore || datastore.status !== DatastoreStatus.ONLINE) return null;

		if (
			req.userId != datastore.userId &&
			!datastore.allowedSMBUsers.includes(req.userId)
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
		@Arg("datastoreId") datastoreId: number,
		@Arg("updateProps") updateProps: UpdateDatastoreInput
	): Promise<boolean | null> {
		if (!Object.values(updateProps).filter((v) => v != null).length)
			return null;

		const datastore = await Datastore.findOne({
			where: { id: datastoreId, userId: req.userId },
		});
		if (
			!datastore ||
			datastore.status == DatastoreStatus.INIT ||
			datastore.userId != req.userId
		)
			return null;

		const host = await Node.findOne({ where: { id: datastore.localNodeId } });
		if (!host) return null;

		let updateSMBRequired = false;

		if (updateProps.sharedUsers) updateSMBRequired = await updateSharedUsers({ host, datastore, datastoreId, sharedUsers: updateProps.sharedUsers || [], updateSMBRequired })
		updateSMBRequired = await updateDatastoreOwnerAndName({ host, datastore, updateProps, updateSMBRequired })
		if (updateProps?.allowedSMBUsers?.length) updateSMBRequired = await updateSharedUsersServices({ updateProps, updateSMBRequired, datastore })

		if (updateSMBRequired) {
			datastore.status = DatastoreStatus.INIT;

			updateSMB(host.loginName).then(async (res) => {
				console.log(res);

				datastore.status = DatastoreStatus.ONLINE;
				await datastore.save();
			});
		}

		await datastore.save();

		return true;
	}
}
