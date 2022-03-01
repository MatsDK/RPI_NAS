import { SharedDatastore } from "../../entity/SharedDatastore";

export const hasAccessToDatastore = async (datastoreId: number, userId: number, datastoreOwnerId: number) =>
	(!!(await SharedDatastore.count({ where: { datastoreId, userId } })) || datastoreOwnerId == userId)