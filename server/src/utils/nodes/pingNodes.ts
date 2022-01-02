import { Node } from "../../entity/CloudNode";
import { getOrCreateNodeClient } from "./nodeClients";

export const pingNodes = async (nodes: Node[]): Promise<Node[]> => {
	nodes.forEach(async (node) => {
		if (node.hostNode) {
			node.pingResult = true
			return
		}

		const client = await getOrCreateNodeClient({ node, ping: true })
		node.pingResult = !!client?.ping
	})

	return nodes
}