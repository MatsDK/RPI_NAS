import fs from "fs-extra";
import archiver from "archiver"

interface ArchiveFolderProps {
	sessionId: string
	folderName: string
}

export const archiveFolder = async ({ folderName, sessionId }: ArchiveFolderProps): Promise<{ err: any, path?: string }> => {
	try {
		const zipPath = `${folderName}.zip`,
			output = fs.createWriteStream(zipPath),
			archive = archiver("zip", {
				zlib: { level: 9 },
			});

		archive.on("warning", (err) => {
			if (err.code === "ENOENT") console.log(err);
			else return { err };
		});
		archive.on("error", (err) => {
			return { err };
		});

		archive.pipe(output);

		archive.directory(folderName, `${sessionId}`);

		await archive.finalize();

		await new Promise((res, rej) => {
			output.on("close", () => {
				res("");
			});

			output.on("error", (e) => rej(e));
		});

		return { err: false, path: zipPath }
	} catch (err) {
		return { err }
	}
}