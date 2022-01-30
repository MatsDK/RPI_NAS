import { exec } from "../exec";

export const createGroup = async (
	groupName: string,
	userName: string
): Promise<{ err: any }> => {
	const { stderr: createGroupErr } = await exec(`groupadd ${groupName}`);
	if (createGroupErr) return { err: createGroupErr };

	const { stderr: addOwnerToGroupErr } = await exec(
		`usermod -aG ${groupName} ${userName}`
	);
	if (addOwnerToGroupErr) return { err: addOwnerToGroupErr };

	return { err: false };
};

export const addToGroup = async (userName: string, groupName: string): Promise<boolean> => {
	const { stderr } = await exec(`usermod -aG ${groupName} ${userName}`)
	if (stderr) {
		throw new Error(stderr)
	}

	return true
}

export const removeFromGroup = async (userName: string, groupName: string): Promise<boolean> => {
	const { stderr } = await exec(`gpasswd -d ${userName} ${groupName}`)

	if (stderr) {
		throw new Error(stderr)
	}

	return true
}