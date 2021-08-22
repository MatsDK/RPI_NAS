import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Express from "express";
import { buildSchema } from "type-graphql";

dotenv.config();

(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/modules/**/*.ts"],
    }),
    context: ({ req, res }: any) => ({
      req,
      res,
    }),
  });

  const app = Express();

  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("> Server started on http://localhost:4000/graphql");
  });
})();
