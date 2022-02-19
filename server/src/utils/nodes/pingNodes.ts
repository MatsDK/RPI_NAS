import { Node } from "../../entity/CloudNode";
import { getOrCreateNodeClient } from "./nodeClients";

export const pingNodes = async (nodes: Node[]): Promise<Node[]> => {
	const ret: Node[] = []

	for (let node of nodes) {
		if (node.hostNode) {
			node.pingResult = true
		} else {
			const client = await getOrCreateNodeClient({ node, ping: true })
			node.pingResult = !!client?.ping
			console.log(node, client?.ping)
		}

		ret.push(node)
	}

	return ret
}