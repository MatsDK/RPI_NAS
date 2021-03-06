import { Datastore } from "../../entity/Datastore";
import fs from "fs-extra";
import fsPath from "path";
import { CopyMoveInput } from "./copyMoveMutationInput";
import { Node } from "../../entity/CloudNode";
import { ApolloError } from "apollo-server-core";
import { hasAccessToDatastore } from "../../utils/datastore/hasAccessToDatastore";
import { moveAndCopyRemote } from "./moveAndCopyRemote";
import { updateOwnership } from "./updateOwnership";

export const MoveCopyData = async ({
	data,
	datastoreId,
	destination,
	type,
}: CopyMoveInput & { type: "copy" | "move" }, userId: number) => {
	const { err, ...rest } = await getDsAndNodes(datastoreId, destination.datastoreId, userId)
	if (err) throw new ApolloError(err)

	const { destDatastore, srcDatastore, srcNode, destNode } = rest as GetDsAndNodeReturn

	if (srcNode.id == destNode.id && srcNode.hostNode)
		for (const { path } of data) {
			const srcPath = fsPath.join(srcDatastore.basePath, path),
				destPath = fsPath.join(
					destDatastore.basePath,
					destination.path,
					fsPath.basename(path)
				);

			try {
				switch (type) {
					case "move": {
						if (isSubDir(srcPath, destPath)) {
							console.log("Cannot move inside itself")
							continue
						}

						fs.moveSync(srcPath, destPath)
						break
					}
					case "copy": {
						fs.copySync(srcPath, destPath, { recursive: true });
						break
					}
				}

				await updateOwnership(datastoreId, userId, { node: destNode, datastore: destDatastore })
			} catch (err) {
				console.log(err);
				return null;
			}
		}
	else {
		const { err } = await moveAndCopyRemote(rest as GetDsAndNodeReturn, userId, { type, data, destination })
		if (err) {
			console.log(err)
			return null
		}
	}

	return true;
};

const isSubDir = (srcPath: string, destPath: string): boolean => {
	const relative = fsPath.relative(srcPath, destPath);
	return !!relative && !relative.startsWith('..') && !fsPath.isAbsolute(relative);
}

export interface GetDsAndNodeReturn {
	srcDatastore: Datastore,
	srcNode: Node
	destDatastore: Datastore,
	destNode: Node;
	err?: any
}

const getDsAndNodes = async (srcDatastoreId: number, destDatastoreId: number, userId: number): Promise<GetDsAndNodeReturn | { err: any }> => {
	const datastoresMap: Map<number, Datastore> = new Map();
	const nodesMap: Map<number, Node> = new Map();

	const datastores = await Datastore.find({
		where: [{ id: srcDatastoreId }, { id: destDatastoreId }],
	});

	datastores.forEach((v) => datastoresMap.set(v.id, v));

	const srcDatastore = datastoresMap.get(srcDatastoreId),
		destDatastore = datastoresMap.get(destDatastoreId);

	if (!srcDatastore || !destDatastore) return {
		err: "Datastores not found"
	}

	const nodes = await Node.find({
		where: [{ id: srcDatastore.localNodeId }, { id: destDatastore.localNodeId }],
	});

	nodes.forEach((v) => nodesMap.set(v.id, v));

	const srcNode = nodesMap.get(srcDatastore.localNodeId),
		destNode = nodesMap.get(destDatastore.localNodeId);

	if (!srcNode || !destNode) return {
		err: "nodes not found"
	}

	if (!(await hasAccessToDatastore(srcDatastoreId, userId, srcDatastore.userId)) ||
		!(await hasAccessToDatastore(destDatastoreId, userId, destDatastore.userId))) return { err: "No Access allowed" }

	return {
		srcDatastore,
		destDatastore,
		srcNode,
		destNode,
	}
}