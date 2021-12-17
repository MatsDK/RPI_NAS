import { Node } from "../entity/CloudNode";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

const PING_QUERY = gql`
{
	ping
}
`

interface GlobalType {
	CONNECTIONS?: Map<number, any>
}

const Global = global as unknown as GlobalType;

type getOrCreateNodeClientProps = { node?: Node, uri?: string }

export const getOrCreateNodeClient = async ({ node, uri }: getOrCreateNodeClientProps): Promise<any> => {
	return new Promise(async (res, rej) => {
		uri = node == null ? uri : `http://${node.ip}:${node.port}/graphql`
		if (!uri) return null

		if (!Global.CONNECTIONS) Global.CONNECTIONS = new Map()
		//if (Global.CONNECTIONS.get(node.id)) return Global.CONNECTIONS.get(node.id)

		console.log(node, uri);
		const client = new ApolloClient({
			uri,
			cache: new InMemoryCache()
		});
		console.log("Client: ", client);
		if (node) Global.CONNECTIONS.set(node.id, client);

		const r = await client.query({ query: PING_QUERY });
		console.log(r)

		res(client)
	})
}
