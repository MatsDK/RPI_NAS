import { Node } from "../../entity/CloudNode";
import fs, { createWriteStream } from "fs-extra"
import fsPath from "path";
import { Datastore } from "../../entity/Datastore";
import { Upload } from "../../types/Upload";
import { TMP_FOLDER } from "../../constants";
import { v4 } from "uuid";
import { getOrCreateNodeClient } from "../nodes/nodeClients";
import { CopyMoveMutation } from "../../modules/Folder/CopyMoveMutation";
import { withTimeout } from "../withTimeout";

interface Props {
	datastore: Datastore
	node: Node
	path: string
	files: Upload[]
}

export const uploadFilesToRemote = async ({ datastore, node, path, files }: Props): Promise<{ err: any }> => {
	try {
		const tmpFolder = fsPath.join(TMP_FOLDER, v4())
		fs.mkdirSync(tmpFolder)

		const { err } = await uploadFiles({ files, path: tmpFolder })
		if (err) return { err }

		const client = await getOrCreateNodeClient({ node, ping: false })
		if (!client) return { err: `could not connect to node: ${node.name}` }

		const variables = {
			type: "copy",
			remote: false,
			srcNode: node,
			nodeLoginName: node.loginName,
			datastoreName: fsPath.basename(datastore.basePath),
			datastoreBasePath: datastore.basePath,
			srcDatastoreId: -1
		}

		const res = await withTimeout(client.conn.mutate({
			mutation: CopyMoveMutation,
			variables: {
				downloadDirectories: [],
				downloadFiles: (await Promise.all(files)).map(({ filename }) => ({
					local: fsPath.join(datastore.basePath, path, filename),
					remote: fsPath.join(tmpFolder, filename),
					type: "file"
				})),
				...variables
			}
		}), 750)

		if (!res) {
			console.log("FAILED", res)
			return { err: true }
		}

		console.log(res)

		return { err: false }
	} catch (err) {
		return { err }
	}
}

interface UploadFilesProps {
	files: Upload[]
	path: string
}

export const uploadFiles = async ({ files, path }: UploadFilesProps): Promise<{ err: any }> => {
	for (let file of await Promise.all(files)) {
		const filePath = fsPath.join(path, file.filename)

		try {
			await new Promise((res, rej) => {
				file.createReadStream()
					.pipe(createWriteStream(filePath))
					.on("finish", () => res(null))
					.on("error", err => rej(err.message))
			})
		} catch (err) {
			return { err }
		}
	}

	return { err: false }
}