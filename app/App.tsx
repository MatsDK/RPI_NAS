import React from "react";
import { ApolloProvider } from "react-apollo";
import { Routes } from "./src/components/FolderRoutes";
import apolloClient from "./src/lib/apolloClient";

export default () => {
  return (
    <ApolloProvider client={apolloClient() as any}>
      <Routes />
    </ApolloProvider>
  );
};
