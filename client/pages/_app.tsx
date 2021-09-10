import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
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
          <Component {...pageProps} />
        </FolderContext.Provider>
      </ApolloProvider>
    </div>
  );
};

export default withApollo(MyApp);
