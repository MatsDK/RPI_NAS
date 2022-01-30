import { ApolloError } from "apollo-server-express";
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

export const addToGroup = async (userName: string, groupNames: string | string[]): Promise<boolean> => {
	if (Array.isArray(groupNames)) {
		for (const groupName of groupNames) {
			const { stderr } = await exec(`usermod -aG ${groupName} ${userName}`)
			if (stderr) throw new ApolloError(stderr)
		}
	} else {
		const { stderr } = await exec(`usermod -aG ${groupNames} ${userName}`)
		if (stderr) {
			throw new Error(stderr)
		}
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