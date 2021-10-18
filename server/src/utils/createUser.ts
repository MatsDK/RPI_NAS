import { exec } from "./exec"

export const createUser = async (osName: string, password: string): Promise<{err: any}> => {
	const { stdout: hashOut, stderr: hashErr } = await exec(`perl -e 'print crypt("${password}", "salt")'`)
	if(!hashOut?.trim() || hashErr) return { err: hashErr };

	
	const { stdout: addOut, stderr: addErr } = await exec(`useradd -p ${hashOut.trim()} ${osName}`);
	if(addErr) return { err: addErr } 

	return {err: false}
}
