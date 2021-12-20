import { Any } from "typeorm";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { toggleService } from "../services/toggleService";
import { Datastore } from "../../entity/Datastore";
import { groups } from "./handleGroups";
import { UpdateDatastoreInput } from "../../modules/DataStore/UpdateDatastoreInput";
import { Node } from "../../entity/CloudNode";

interface UpdateSharedUsersProps {
	sharedUsers: number[]
	datastoreId: number
	datastore: Datastore
	updateSMBRequired: boolean
}

export const updateSharedUsers = async ({ sharedUsers, datastoreId, datastore, updateSMBRequired }: UpdateSharedUsersProps): Promise<boolean> => {
	const sharedDatastoreUsers = await SharedDataStore.find({
		where: { dataStoreId: datastoreId },
	});

	const newSharedUsers = sharedUsers.filter(
		(userId) => !sharedDatastoreUsers.find((u) => u.userId == userId)
	),
		removedSharedUsers = sharedDatastoreUsers.filter(
			({ userId }) => !sharedUsers?.includes(userId)
		);

	if (newSharedUsers.length) {
		await SharedDataStore.insert(
			newSharedUsers.map((id) => ({ userId: id, dataStoreId: datastoreId }))
		);
		await groups.add(
			newSharedUsers.map((id) => ({
				userId: id,
				dataStoreId: datastore.id,
			}))
		);
	}

	if (removedSharedUsers.length) {
		await SharedDataStore.delete({
			id: Any(removedSharedUsers.map(({ id }) => id)),
		});
		await groups.remove(removedSharedUsers);

		const ids = removedSharedUsers.map(({ userId }) => userId);

		datastore.allowedSMBUsers = datastore.allowedSMBUsers.filter(
			(id) => !ids.includes(id)
		);

		const deleteServices = await DatastoreService.delete({
			datastoreId,
			userId: Any(ids),
		});
		if (deleteServices.affected) updateSMBRequired = true;
	}

	return updateSMBRequired
}

interface UpdateDatastoreOwnerAndNameProps {
	updateSMBRequired: boolean
	updateProps: UpdateDatastoreInput
	datastore: Datastore
	host: Node
}

export const updateDatastoreOwnerAndName = async ({ updateSMBRequired, updateProps, datastore, host }: UpdateDatastoreOwnerAndNameProps): Promise<boolean> => {
	const datastoreServices = await DatastoreService.find({
		where: { datastoreId: datastore.id, serviceName: ServiceNames.SMB },
	});

	if (
		updateProps.ownerSMBEnabled != null &&
		!!datastoreServices.find(({ userId }) => datastore.userId === userId) !=
		updateProps.ownerSMBEnabled
	) {
		updateSMBRequired = true;

		await toggleService({
			datastore,
			host,
			userId: datastore.userId,
			serviceName: "SMB",
			updateSMBEnabled: false,
		});
	}

	if (updateProps.name != null) {
		const newName = updateProps.name.replace(/[^a-z0-9]/gi, "_");

		if (newName != datastore.name && newName.trim()) {
			datastore.name = newName;
			if (datastoreServices.length) updateSMBRequired = true;
		}
	}

	return updateSMBRequired
}

interface UpdateSharedUsersServicesProps {
	updateSMBRequired: boolean
	updateProps: UpdateDatastoreInput
	datastore: Datastore
}

export const updateSharedUsersServices = async ({ updateSMBRequired, updateProps, datastore }: UpdateSharedUsersServicesProps): Promise<boolean> => {
	const removedUsers = updateProps.allowedSMBUsers!
		.filter(({ allowed }) => !allowed)
		.map(({ userId }) => userId);

	const newAllowedSMBUsers = Array.from(
		new Set([
			...datastore.allowedSMBUsers,
			...updateProps.allowedSMBUsers!
				.filter(({ allowed }) => allowed)
				.map(({ userId }) => userId),
		])
	).filter((id) => !removedUsers.includes(id));

	const removedSharedUsers =
		updateProps.sharedUsers != null
			? (
				await SharedDataStore.find({
					where: { dataStoreId: datastore.id },
				})
			)
				.filter(
					({ userId }) => !updateProps.sharedUsers?.includes(userId)
				)
				.map(({ userId }) => userId)
			: [];

	datastore.allowedSMBUsers = newAllowedSMBUsers.filter(
		(id) => !removedSharedUsers.includes(id)
	);
	const { affected } = await DatastoreService.delete({
		datastoreId: datastore.id,
		serviceName: ServiceNames.SMB,
		userId: Any(removedUsers),
	});
	if (affected) updateSMBRequired = true;

	return updateSMBRequired
}