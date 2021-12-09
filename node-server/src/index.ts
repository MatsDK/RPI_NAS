require("dotenv").config();
import {
	ApolloClient,
	InMemoryCache,
	gql,
} from "@apollo/client/core";
import 'cross-fetch/polyfill';


(async () => {
	const uri = `http://${process.env.HOST_IP}:${process.env.HOST_PORT}/graphql`;
	const client = new ApolloClient({
		uri ,
		cache: new InMemoryCache()
	});

	const PING_QUERY = gql`
		{
			ping  
		}
	`

	const { data }  = await client.query({query: PING_QUERY})

	console.log(data)
})()
