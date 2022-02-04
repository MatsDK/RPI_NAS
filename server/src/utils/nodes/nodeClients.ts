import { Node } from "../../entity/CloudNode";
import { v4 } from "uuid";
import { ApolloClient, InMemoryCache, gql, NormalizedCacheObject, createHttpLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

const PING_QUERY = gql`
{
	ping
}
`


const SET_SESSION_TOKEN_MUTATION = gql`
mutation SetSessionToken($sessionToken: String!, $token: String!) {
  setSessionToken(sessionToken: $sessionToken, token: $token)
}
`

interface GlobalType {
	CONNECTIONS?: Map<number, Client>
}

interface Client {
	ping: boolean | null
	conn: ApolloClient<NormalizedCacheObject>
	sessionToken: string
}

const Global = global as unknown as GlobalType;

type getOrCreateNodeClientProps = { node?: Node, uri?: string, ping: boolean, setSessionToken?: boolean }

export const getOrCreateNodeClient = async ({ node, uri, ping, setSessionToken = false }: getOrCreateNodeClientProps): Promise<Client | null> => {
	return new Promise(async (res, rej) => {
		uri = node == null ? uri : `http://${node.ip}:${node.port}/graphql`
		if (!uri) return null

		if (!Global.CONNECTIONS) Global.CONNECTIONS = new Map()

		let client = node && Global.CONNECTIONS.get(node.id)

		const sessionToken = client?.sessionToken || v4(),
			conn = (node && client?.conn) || createNewClient(uri, sessionToken)

		if (node && setSessionToken) {
			const res = await conn.mutate({
				mutation: SET_SESSION_TOKEN_MUTATION,
				variables: {
					token: node.token,
					sessionToken
				}
			})

			console.log("Connected to node", res)
		}

		client = { conn, ping: null, sessionToken }
		if (node) Global.CONNECTIONS.set(node.id, client);

		if (ping) {
			const res = await client.conn.query({ query: PING_QUERY });
			client.ping = res.data.ping || null
		}

		res(client)
	})
}

const createNewClient = (uri: string, sessionToken: string) => {
	const httpLink = createHttpLink({ uri }),
		authLink = setContext((_, { headers }) => {
			const token = sessionToken

			return {
				headers: {
					...headers,
					authorization: token
				}
			}
		});

	return new ApolloClient({
		link: authLink.concat(httpLink),
		cache: new InMemoryCache()
	});

}