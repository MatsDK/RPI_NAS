import { ApolloClient, InMemoryCache, gql, createHttpLink } from "@apollo/client/core";
import { setContext } from '@apollo/client/link/context';
import fs from "fs-extra";

const CREATE_NODE_REQUEST_MUTATION = gql`
mutation CreateNodeRequestMutation($ip:String!, $port:Float!) {
	  createNodeRequest(port:$port, ip:$ip)
}
`;

export class Connection {
	uri: string
	token: string | null
	id: number | null
	client: any
	headersCallback: (() => ({ id: null | number, token: null | string })) | null

	constructor(uri: string) {
		this.token = null;
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
		const res = await this.client.mutate({
			mutation: CREATE_NODE_REQUEST_MUTATION,
			variables: { ip: process.env.LOCAL_IP, port: Number(process.env.PORT) }
		})

		console.log(res);
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
}
const Global = global as unknown as GlobalType;

export const getOrCreateConnection = (): Connection =>
	Global.CONNECTION || (Global.CONNECTION = new Connection(`http://${process.env.HOST_IP}:${process.env.HOST_PORT}/graphql`))

