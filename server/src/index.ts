import "reflect-metadata";
import fs from "fs-extra"
import { connectNodes } from "./utils/nodes/connectNodes"
import { graphqlUploadExpress } from 'graphql-upload';
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import { buildSchema } from "type-graphql";
import {
	ApolloServerPluginLandingPageDisabled,
	ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { router } from "./routers/indexRouter";
import { createConnection } from "typeorm";
import "cross-fetch/polyfill"
import { TMP_FOLDER } from "./constants";

dotenv.config();

(async () => {
	if (!fs.existsSync(TMP_FOLDER)) fs.mkdirSync(TMP_FOLDER)

	const app = Express();
	app.use(cookieParser("Authorization"));

	const apolloServer = new ApolloServer({
		plugins: [
			process.env.NODE_ENV === "production"
				? ApolloServerPluginLandingPageDisabled()
				: ApolloServerPluginLandingPageGraphQLPlayground(),
		],
		schema: await buildSchema({
			resolvers: [__dirname + `/modules/**/*.${process.env.NODE_ENV === "production" ? "js" : "ts"}`],
		}),
		context: ({ req, res }) => ({ req, res }),
	});

	await createConnection({
		"synchronize": true,
		"logging": process.env.NODE_ENV !== "production",
		"type": "postgres",
		"host": "localhost",
		"port": 5432,
		"username": "postgres",
		"password": process.env.POSTGRES_PASSWORD,
		"database": "cloud",
		"entities": [process.env.NODE_ENV === "production" ? "dist/entity/*.*" : "src/entity/*.*"]
	}).then(() =>
		console.log("> Connected to postgreSQL database")
	);

	app.use(cors({
		credentials: true,
		exposedHeaders: ["Cookie", "authorization"],
		origin: (_origin, cb) => {
			cb(null, true);
		}
	}));

	app.use("/", router);

	await apolloServer.start();

	app.use(graphqlUploadExpress());

	apolloServer.applyMiddleware({
		app,
		cors: { credentials: false, origin: process.env.CLIENT_URL },
	});

	app.listen(4000, () => {
		console.log("> Server started on http://localhost:4000/graphql");

		connectNodes().then((res) => {
			// console.log("Connected Nodes", res)
		}).catch((err) => {
			console.log(err)
		})
	});
})();
