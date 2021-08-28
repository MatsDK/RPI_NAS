import * as React from "react";
import { FolderContextValue, FolderContext } from "lib/providers/folderState";
import App from "next/app";
import "../css/global.css";
import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import withApollo from "lib/HOC/withApollo";

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;

    return (
      <div>
        <ApolloProvider client={apolloClient}>
          <FolderContext.Provider value={FolderContextValue}>
            <Component {...pageProps} />
          </FolderContext.Provider>
        </ApolloProvider>
      </div>
    );
  }
}

export default withApollo(MyApp);
