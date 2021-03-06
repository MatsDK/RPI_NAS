import { getConnection } from "typeorm"
import fsPath from "path";

export const getSharedDatastoresWithoutInitializedUser = async (userId: number, nodeId: number) => {
	// SELECT d.name, d."basePath" FROM shared_datastore LEFT JOIN datastore d ON shared_datastore."datastoreId"=d.id 
	// RIGHT JOIN node ON node.id=d."localNodeId" 
	// WHERE shared_datastore."userId"=10 AND d."localNodeId"=25 AND NOT (10 = ANY (node."initializedUsers"));
	const res: Array<{ name: string, basePath: string }> = await getConnection().query(`SELECT d.name, d."basePath" FROM shared_datastore LEFT JOIN datastore d ON shared_datastore."datastoreId"=d.id 
		RIGHT JOIN node ON node.id=d."localNodeId" 
		WHERE shared_datastore."userId"=$1 AND d."localNodeId"=$2 AND NOT ($1 = ANY (node."initializedUsers"));
	`.replace("\n", " "), [userId, nodeId])

	return res.map(({ basePath }) => fsPath.basename(basePath))
}

