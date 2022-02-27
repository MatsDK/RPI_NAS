import { createSSHClientForNode } from "./createSSHClientForNode"
import fsPath from "path"
import { DownloadSession } from "./downloadSessions"
import { TMP_FOLDER } from "../../constants"
import fs from "fs-extra"
import { archiveFolder } from "./archiveFolder"

interface Props {
	session: DownloadSession
	sessionId: string
}

export const getRemoteDownloadPath = async ({ session, sessionId }: Props): Promise<{ err: any, path?: string }> => {
	try {
		const client = await createSSHClientForNode(session.node),
			tmpFolder = fsPath.join(TMP_FOLDER, sessionId)

		fs.mkdirSync(tmpFolder)

		const formatPaths = (type: "file" | "directory") => session.paths
			.filter((p) => p.type === type)
			.map(({ path }) =>
				({ remote: path, local: fsPath.join(tmpFolder, fsPath.basename(path)) })
			)

		await Promise.all([
			client.download.directories(formatPaths("directory")),
			client.download.files(formatPaths("file")),
		])

		if (session.paths.length === 1 && session.paths[0].type === "file")
			return { err: false, path: fsPath.join(tmpFolder, fsPath.basename(session.paths[0].path)) }

		const { err, path, } = await archiveFolder({ folderName: tmpFolder, sessionId })
		if (err) {
			console.log(err)
			return { err }
		}

		return { err: false, path }
	} catch (err) {
		return { err }
	}

}