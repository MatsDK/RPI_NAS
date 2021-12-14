require("dotenv").config();
import "reflect-metadata";
import 'cross-fetch/polyfill';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql"
import Express from "express";
import { getOrCreateConnection } from "./utils/client";

(async () => {
	const app = Express();
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [__dirname + "/modules/**/*.ts"],
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	getOrCreateConnection();

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: false,
	});

	app.listen(process.env.PORT, () => console.log(`> Graphql server listening on port: ${process.env.PORT}`));
})()
