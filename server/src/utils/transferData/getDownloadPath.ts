import fs from "fs-extra";
import fsPath from "path";
import { TMP_FOLDER } from "../../constants";
import { DownloadPathsInput } from "../../modules/TransferData/DownloadSessionInput";
import { archiveFolder } from "./archiveFolder";

export const getDownloadPath = async (
	session: DownloadPathsInput[],
	sessionId: string
): Promise<{ path: string, deleteTmpFolder: boolean, err?: any }> => {
	if (session.length === 1 && session[0].type === "file")
		return { path: session[0].path, deleteTmpFolder: false }

	const folderName = fsPath.join(TMP_FOLDER, sessionId);

	fs.mkdirSync(folderName);

	for (const item of session) {
		if (item.type === "file")
			fs.copyFileSync(item.path, fsPath.join(folderName, fsPath.basename(item.path)));
		else fs.copySync(item.path, fsPath.join(folderName, fsPath.basename(item.path)));
	}

	const { err, path } = await archiveFolder({ sessionId, folderName })
	if (err) console.log(err)
	if (!path) return { err: "could not create path", deleteTmpFolder: true, path: "" }

	fs.removeSync(folderName);

	return { path, deleteTmpFolder: true }
};
