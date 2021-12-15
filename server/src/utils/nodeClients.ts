import { Node } from "../entity/CloudNode";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

const PING_QUERY = gql`
{
	query
}
`

interface GlobalType {
	CONNECTIONS?: Map<number, any>
}

const Global = global as unknown as GlobalType;

export const getOrCreateNodeClient = async (node: Node): Promise<any> => {
	if (!Global.CONNECTIONS) Global.CONNECTIONS = new Map()
	//if (Global.CONNECTIONS.get(node.id)) return Global.CONNECTIONS.get(node.id)

	const client = Global.CONNECTIONS.get(node.id) || new ApolloClient({
		uri: `http://${node.ip}:${node.port}/graphql`,
		cache: new InMemoryCache()
	});
	Global.CONNECTIONS.set(node.id, client);

	try {
		const res = await client.query({ query: PING_QUERY });
		if (res.data?.ping) return client
	} catch {
		return null
	}

	return null
}
