import "reflect-metadata";
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

dotenv.config();

(async () => {
  const app = Express();
  app.use(cookieParser("Authorization"));

  const apolloServer = new ApolloServer({
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    schema: await buildSchema({
      resolvers: [__dirname + "/modules/**/*.ts"],
    }),
    context: ({ req, res }) => ({ req, res }),
  });


  await createConnection().then(() =>
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
    }).catch(err => {
      console.log(err)
    })
  });
})();
