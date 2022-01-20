import { Node } from "../../entity/CloudNode";
import fsPath from "path"
import { Client } from "ssh-package"
import { CopyMoveDataObject, CopyMoveDestinationObject } from "./copyMoveMutationInput";
import { GetDsAndNodeReturn } from "./moveCopyData";
import { Datastore } from "../../entity/Datastore";

interface moveAndCopyProps {
	type: "copy" | "move"
	data: CopyMoveDataObject[]
	destination: CopyMoveDestinationObject
}

export const moveAndCopyRemote = async ({ destDatastore, destNode, srcNode, srcDatastore }: GetDsAndNodeReturn, { type, data, destination }: moveAndCopyProps) => {
	if (destNode.hostNode) {
		try {
			const client = await createSSHClientForNode(srcNode)

			const { downloadFiles, downloadDirectories } = parseMoveAndCopyDataPaths(data, srcDatastore, destDatastore, destination.path)

			await Promise.all([
				client.download.files(downloadFiles),
				client.download.directories(downloadDirectories),
			])

		} catch (e) {
			console.log(e)
			return { err: e }
		}
	}

}

const createSSHClientForNode = async (node: Node): Promise<Client> => new Promise((res, rej) => {
	const client = new Client({
		host: node.ip,
		password: node.password,
		username: node.loginName,
	})

	client.on("ready", () => {
		res(client)
	})

	client.on("timeout", () => rej("connection timed out"))
})

const parseMoveAndCopyDataPaths = (data: CopyMoveDataObject[], srcDatastore: Datastore, destDatastore: Datastore, destinationPath: string) => {
	const _ = (_data: CopyMoveDataObject[]) => _data.map(({ path }) => {
		const remote = fsPath.join(srcDatastore.basePath, path),
			local = fsPath.join(
				destDatastore.basePath,
				destinationPath,
				fsPath.basename(path)
			)

		return { local, remote }
	})

	return {
		downloadDirectories: _(data.filter(({ type }) => type == "directory")),
		downloadFiles: _(data.filter(({ type }) => type == "file"))
	}

}
