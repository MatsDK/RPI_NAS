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