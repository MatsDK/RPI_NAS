import { Node } from "../../entity/CloudNode";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

const PING_QUERY = gql`
{
	ping
}
`

interface GlobalType {
	CONNECTIONS?: Map<number, Client>
}

interface Client {
	ping: boolean | null
	conn: any
}

const Global = global as unknown as GlobalType;

type getOrCreateNodeClientProps = { node?: Node, uri?: string, ping: boolean }

export const getOrCreateNodeClient = async ({ node, uri, ping }: getOrCreateNodeClientProps): Promise<Client | null> => {
	return new Promise(async (res, rej) => {
		uri = node == null ? uri : `http://${node.ip}:${node.port}/graphql`
		if (!uri) return null

		if (!Global.CONNECTIONS) Global.CONNECTIONS = new Map()

		const conn = new ApolloClient({
			uri,
			cache: new InMemoryCache()
		});
		const client = { conn, ping: null }
		if (node) Global.CONNECTIONS.set(node.id, client);

		if (ping) {
			const res = await client.conn.query({ query: PING_QUERY });
			client.ping = res.data.ping || null
		}

		res(client)
	})
}