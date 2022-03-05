import { Node } from "../entity/CloudNode";
import { User } from "../entity/User";
import { exec } from "./exec";
import fs from "fs-extra";

export const createUser = async (
	osName: string,
	password: string,
	checkUsers: boolean = true,
	checkNodes: boolean = true
): Promise<{ err: any }> => {
	if ((checkNodes && !!(await Node.count({ where: { loginName: osName } })))
		|| (checkUsers && !!(await User.count({ where: { osUserName: osName } }))))
		return { err: "Can't create a user with that name" };

	const { stdout: hashOut, stderr: hashErr } = await exec(
		`perl -e 'print crypt("${password}", "salt")'`
	);
	if (!hashOut?.trim() || hashErr) return { err: hashErr };

	const { stderr: addErr } = await exec(
		`useradd -p ${hashOut.trim()} ${osName}`
	);
	if (addErr) return { err: addErr };

	const path = `/home/${osName}`;
	if (!fs.existsSync(path)) {
		const { stderr: createFolderErr } = await exec(
			`mkdir ${path} && chown ${osName}:${osName} ${path} && chmod 550 ${path}`
		);
		if (createFolderErr) return { err: createFolderErr };
	}

	const { stderr: setSMBPasswdErr } = await exec(
		`(echo ${password}; echo ${password}) | smbpasswd -s -a ${osName}`
	);
	if (setSMBPasswdErr) return { err: setSMBPasswdErr };

	return { err: false };
};
