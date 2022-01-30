import { Any } from "typeorm";
import { Node } from "../../entity/CloudNode";
import { User } from "../../entity/User";
import { getOrCreateNodeClient } from "../nodes/nodeClients";
import { UpdateSharedUsersMutation } from "./UpdateSharedUsersMutation";

interface RemoteSharedUsers {
	newUsers: number[]
	removedUsers: number[]
}

export const updateRemoteSharedUsers = async ({ newUsers, removedUsers }: RemoteSharedUsers, groupName: string, node: Node): Promise<boolean | string> => {
	if (!newUsers.length && !removedUsers.length) return false

	const client = await getOrCreateNodeClient({ node, ping: false })
	if (!client) return "Could not connect to client"

	try {
		const res = await client.conn.mutate({
			mutation: UpdateSharedUsersMutation,
			variables: {
				...(await getUserNames(newUsers, removedUsers)),
				groupName
			}
		})

		console.log(res)

	} catch (err) {
		return err as string
	}

	return false
}

const getUserNames = async (newUsers: number[], removedUsers: number[]): Promise<{ newUsers: string[], removedUsers: string[] }> => {
	const users = await User.find({ where: { id: Any([...newUsers, ...removedUsers]) } })

	const filter = (userIds: number[]) => userIds.map((_id) => users.find(({ id }) => id == _id)?.osUserName).filter(name => name != null) as string[]
	return { newUsers: filter(newUsers), removedUsers: filter(removedUsers) }
}