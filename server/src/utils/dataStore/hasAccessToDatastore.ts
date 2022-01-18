import { SharedDataStore } from "../../entity/SharedDataStore";

export const hasAccessToDatastore = async (dataStoreId: number, userId: number, datastoreOwnerId: number) =>
	(!(await SharedDataStore.findOne({ where: { dataStoreId, userId } })) && datastoreOwnerId != userId)