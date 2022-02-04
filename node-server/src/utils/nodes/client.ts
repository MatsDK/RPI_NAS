import { ApolloClient, InMemoryCache, gql, createHttpLink, NormalizedCacheObject } from "@apollo/client/core";
import { setContext } from '@apollo/client/link/context';

import fs from "fs-extra";

const CREATE_NODE_REQUEST_MUTATION = gql`
mutation CreateNodeRequestMutation($ip:String!, $port:Float!) {
          createNodeRequest(port: $port, ip: $ip)
}
`;

export class Connection {
	uri: string
	token: string | null
	sessionToken: string | null
	id: number | null
	client: ApolloClient<NormalizedCacheObject>
	headersCallback: (() => ({ id: null | number, token: null | string })) | null

	constructor(uri: string) {
		this.token = null;
		this.sessionToken = null;
		this.id = null
		this.headersCallback = null;

		this.loadToken().then((res) => {
			if (res.err) console.log(res.err.message)
			else this.setHeadersCallback();

			this.uri = uri;
			console.log(`> Connecting to host graphql server: ${uri}`)

			this.setupClient();
		});
	}

	setupClient() {
		const httpLink = createHttpLink({
			uri: this.uri,
		});

		const authLink = setContext((_, { headers }) => {
			const token = this.headersCallback ? this.headersCallback() : null;

			return {
				headers: {
					...headers,
					authorization: token && token.id != null && token.token != null ?
						`${token.id}_${token.token}` : "",
				}
			}
		});

		this.client = new ApolloClient({
			link: authLink.concat(httpLink),
			cache: new InMemoryCache()
		});

		this.connect()
	}

	async connect() {
		try {
			const res = await this.client.mutate({
				mutation: CREATE_NODE_REQUEST_MUTATION,
				variables: { ip: process.env.LOCAL_IP, port: Number(process.env.PORT) }
			})

			console.log(res);
		} catch (e: any) {
			console.log(e.message)
		}
	}

	loadToken(): Promise<any> {
		return new Promise((res, rej) => {
			try {
				const tokens = JSON.parse(fs.readFileSync("token.json").toString());
				this.id = tokens.id || null;
				this.token = tokens.token || null;
				res({ err: false })

			} catch (err) {
				res({ err })
			}
		})
	}

	saveToken() {
		try {
			fs.writeFileSync("token.json", JSON.stringify({ token: this.token, id: this.id }))
		} catch (err: any) {
			console.log(`> Error writing token: ${err.message}`)
		}
	}

	setHeadersCallback() {
		if (this.token == null || this.id == null) this.headersCallback = null
		else this.headersCallback = () => ({ token: this.token, id: this.id })
	}
}


interface GlobalType {
	CONNECTION: Connection
	APOLLO_CLIENTS: Map<string, ApolloClient<NormalizedCacheObject>>
}

const Global = global as unknown as GlobalType;

export const getOrCreateConnection = (uri: string = `http://${process.env.HOST_IP}:${process.env.HOST_PORT}/graphql`): Connection =>
	Global.CONNECTION || (Global.CONNECTION = new Connection(uri))

export const getOrCreateApolloClient = (uri: string = `http://${process.env.HOST_IP}:${process.env.HOST_PORT}/graphql`): ApolloClient<NormalizedCacheObject> =>
	Global.APOLLO_CLIENTS.get(uri) || (Global.APOLLO_CLIENTS.set(uri, new ApolloClient({
		uri,
		cache: new InMemoryCache()
	})).get(uri)!)