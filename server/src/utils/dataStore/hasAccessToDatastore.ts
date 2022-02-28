import { SharedDataStore } from "../../entity/SharedDataStore";

export const hasAccessToDatastore = async (datastoreId: number, userId: number, datastoreOwnerId: number) =>
	(!!(await SharedDataStore.count({ where: { datastoreId, userId } })) || datastoreOwnerId == userId)