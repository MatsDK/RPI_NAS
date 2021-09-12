import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { AppProps } from "next/app";
import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import withApollo from "src/HOC/withApollo";
import {
  CurrentFolderType,
  FolderContext,
  FolderContextValue,
} from "src/providers/folderState";
import "../css/global.css";
import { theme } from "src/utils/theme";

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

const MyApp = (props: AppProps & Props) => {
  const { Component, pageProps, apolloClient } = props;

  const [folderPath, setFolderPath] = useState<CurrentFolderType>({
    path: null,
    dataStoreId: null,
  });

  return (
    <div>
      <ApolloProvider client={apolloClient}>
        <FolderContext.Provider
          value={{
            ...FolderContextValue,
            currentFolderPath: { folderPath, setFolderPath },
          }}
        >
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </FolderContext.Provider>
      </ApolloProvider>
    </div>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps)
    pageProps = await Component.getInitialProps(ctx);

  return { pageProps };
};

export default withApollo(MyApp);
