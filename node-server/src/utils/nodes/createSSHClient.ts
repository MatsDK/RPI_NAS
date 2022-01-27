import { Node } from "../../modules/Node";
import { Client } from "ssh-package";

export const createSSHClientForNode = async ({ ip, password, loginName }: Node): Promise<Client> => new Promise((res, rej) => {
	const client = new Client({
		host: ip,
		username: loginName,
		password,
	})

	client.on("ready", () => res(client))
	client.on("timeout", () => rej("connection timed out"))
})