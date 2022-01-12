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
import { MeContext } from "src/providers/meState";
import { TreeItem } from "generated/apolloComponents";

interface Props {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

const MyApp = (props: AppProps & Props) => {
  const { Component, pageProps, apolloClient } = props;

  const [folderPath, setFolderPath] = useState<CurrentFolderType>({
    path: null,
    datastoreId: null,
    datastoreName: null,
  });
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const [me, setMe] = useState<any>(null);
  const [selectedItems, setSelected] = useState<Map<string, TreeItem>>(
    new Map()
  );

  const Selected = {
    ...FolderContextValue.selected,
    selectedItems,
    setSelected,
  };

  return (
    <ApolloProvider client={apolloClient}>
      <FolderContext.Provider
        value={{
          ...FolderContextValue,
          currentFolderPath: { folderPath, setFolderPath },
          selected: Selected,
          newFolderInput: {
            showNewFolderInput,
            setShowNewFolderInput,
          },
        }}
      >
        <MeContext.Provider value={{ me, setMe }}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </MeContext.Provider>
      </FolderContext.Provider>
    </ApolloProvider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps)
    pageProps = await Component.getInitialProps(ctx);

  return { pageProps };
};

export default withApollo(MyApp);
