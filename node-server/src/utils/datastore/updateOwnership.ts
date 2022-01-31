import { ApolloError } from "apollo-server-express"
import { exec } from "../exec"

export const updateOwnership = async (loginName: string, datastoreName: string, path: string) => {
	try {
		const { stderr } = await exec(`chown ${loginName}:${datastoreName} ${path}/* -R`)
		if (stderr) throw new ApolloError(stderr)

		return true
	} catch (err) {
		console.log(err)
		return null
	}
}