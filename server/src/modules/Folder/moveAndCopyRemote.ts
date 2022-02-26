import { Node } from "../../entity/CloudNode";
import fsPath from "path"
import { Client } from "ssh-package"
import { CopyMoveDataObject, CopyMoveDestinationObject } from "./copyMoveMutationInput";
import { GetDsAndNodeReturn } from "./moveCopyData";
import { Datastore } from "../../entity/Datastore";
import { getOrCreateNodeClient } from "../../utils/nodes/nodeClients";
import { CopyMoveMutation } from "./CopyMoveMutation";
import { DeleteMutation } from "./DeleteMutation";
import { updateOwnership } from "./updateOwnership";

interface moveAndCopyProps {
	type: "copy" | "move"
	data: CopyMoveDataObject[]
	destination: CopyMoveDestinationObject
}

export const moveAndCopyRemote = async ({ destDatastore, destNode, srcNode, srcDatastore }: GetDsAndNodeReturn, userId: number, { type, data, destination }: moveAndCopyProps): Promise<{ err: any }> => {
	if (destNode.hostNode) {
		try {
			const client = await createSSHClientForNode(srcNode)

			const { downloadFiles, downloadDirectories } = parseMoveAndCopyDataPaths(data, srcDatastore, destDatastore, destination.path)
			await Promise.all([
				client.download.files(downloadFiles),
				client.download.directories(downloadDirectories),
			])

			if (type === "move") {
				const client = await getOrCreateNodeClient({ node: srcNode, ping: false })
				if (!client) return { "err": "could not connect to client" }

				const res = await client.conn.mutate({
					mutation: DeleteMutation,
					variables: {
						paths: data.map(({ type, path }) => ({
							path: fsPath.join(srcDatastore.basePath, path),
							type
						}))
					}
				})

				console.log(res)
			}

			await updateOwnership(destDatastore.id, userId, { node: destNode, datastore: destDatastore })
		} catch (err) {
			console.log(err)
			return { err }
		}
	} else {
		const client = await getOrCreateNodeClient({ node: destNode, ping: false })
		if (!client) return { err: "Could not connect to client" }

		const { downloadDirectories, downloadFiles } = parseMoveAndCopyDataPaths(data, srcDatastore, destDatastore, destination.path)

		const res = await client.conn.mutate({
			mutation: CopyMoveMutation,
			variables: {
				type,
				nodeLoginName: destNode.loginName,
				datastoreName: fsPath.basename(destDatastore.basePath),
				datastoreBasePath: destDatastore.basePath,
				remote: destNode.id !== srcNode.id,
				downloadDirectories,
				downloadFiles,
				srcNode,
				srcDatastoreId: srcDatastore.id
			}
		})

		if (!res.errors) {
			return { err: false }
		}

		console.log(res)
	}

	return { err: false }
}

const createSSHClientForNode = async ({ ip, password, loginName }: Node): Promise<Client> => new Promise((res, rej) => {
	const client = new Client({
		host: ip,
		username: loginName,
		password,
	})

	client.on("ready", () => res(client))
	client.on("timeout", () => rej("connection timed out"))
})

const parseMoveAndCopyDataPaths = (data: CopyMoveDataObject[], srcDatastore: Datastore, destDatastore: Datastore, destinationPath: string) => {
	const _ = (_data: CopyMoveDataObject[]) => _data.map(({ path, type }) => {
		const remote = fsPath.join(srcDatastore.basePath, path),
			local = fsPath.join(
				destDatastore.basePath,
				destinationPath,
				fsPath.basename(path)
			)

		return { local, remote, type }
	})

	return {
		downloadDirectories: _(data.filter(({ type }) => type == "directory")),
		downloadFiles: _(data.filter(({ type }) => type == "file"))
	}
}
