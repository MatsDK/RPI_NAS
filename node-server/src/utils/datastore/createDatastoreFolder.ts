import fs from "fs";
import { exec } from "../exec"

type FolderOwner = { folderUser: string, folderGroup: string };

export const createDatastoreFolder = async (
	path: string,
	sizeInMb: number,
	{ folderUser, folderGroup }: FolderOwner
): Promise<{ err: any }> => {
	try {
		fs.mkdirSync(path);

		const { err: createFileSizeErr } = await createFileSize(sizeInMb);
		if (createFileSizeErr) return { err: createFileSizeErr };
		const { err: createFsErr } = await createFs();
		if (createFsErr) return { err: createFsErr };
		const { err: mountFsErr } = await mountFs(path);
		if (mountFsErr) return { err: mountFsErr };

		fs.rmSync("./fileSize");

		const { stderr: chownErr } = await exec(`chown ${folderUser}:${folderGroup} ${path}`)
		if (chownErr) return { err: chownErr }

		return { err: false };
	} catch (err) {
		return { err };
	}
};

const createFileSize = async (sizeInMb: number): Promise<{ err: any }> => {
	// const { stderr } = await exec(
	// 	`dd if=/dev/zero of=fileSize bs=1000 count=${sizeInMb}K`
	// );
	const { stderr } = await exec(
		`truncate -s ${sizeInMb}M fileSize`
	);
	console.log(stderr)

	return { err: false };
};

const createFs = async (): Promise<{ err: any }> => {
	const { stderr } = await exec(`mkfs.ext4 fileSize`);
	console.log(stderr)

	return { err: false };
};

const mountFs = async (path: string): Promise<{ err: any }> => {
	const { stderr } = await exec(`mount fileSize ${path}`);
	console.log(stderr)

	return { err: false };
};