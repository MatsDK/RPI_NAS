import { gql } from "@apollo/client/core"
import { Node } from "../../entity/CloudNode"
import { getOrCreateNodeClient } from "./nodeClients"

const CREATE_REMOTE_DATASTORE_MUTATION = gql`
mutation CreateDatastore($path: String!, $groupName: String!, $sizeInMB: Float!, $ownerUserName: String!) {
	createDatastore(data: { path: $path, groupName: $groupName, sizeInMB: $sizeInMB, ownerUserName: $ownerUserName })
}
`

interface CreateRemoteDatastoreProps {
	node: Node
	path: string
	groupName: string
	sizeInMB: number
	ownerUserName: string
}

export const createRemoteDatastore = async ({ node, ...data }: CreateRemoteDatastoreProps): Promise<{ err: any }> => {
	try {
		const client = await getOrCreateNodeClient({ node, ping: true });
		if (!client) return { err: "Could not connect to client" }

		const res = await client.conn.mutate({ mutation: CREATE_REMOTE_DATASTORE_MUTATION, variables: { ...data } });
		console.log(res)

		return { err: false }
	} catch (err: any) {
		console.log(err)
		return { err: err.message }
	}
}