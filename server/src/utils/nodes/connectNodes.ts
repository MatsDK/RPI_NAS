import { gql } from "@apollo/client/core"
import { Node } from "../../entity/CloudNode"
import { getOrCreateNodeClient } from "./nodeClients"

const CONNECT_REQUEST_MUTATION = gql`
mutation ConnectRequestMutation {
  connectRequest
}
`
export const connectNodes = async () => {
	const nodes = await Node.find({ where: { hostNode: false } })

	for (const node of nodes) {
		const client = await getOrCreateNodeClient({ node, ping: false })
		if (!client) continue

		const { data } = await client.conn.mutate({ mutation: CONNECT_REQUEST_MUTATION })
		if (data.connectRequest) {
			client.ping = true
		}
		console.log(data)
	}
}