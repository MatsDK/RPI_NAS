import * as React from "react";
import { Selected, SelectedContext } from "lib/providers/selected";
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
          <SelectedContext.Provider value={Selected}>
            <Component {...pageProps} />
          </SelectedContext.Provider>
        </ApolloProvider>
      </div>
    );
  }
}

export default withApollo(MyApp);
