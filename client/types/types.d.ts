import { NextPageContext } from "next";
import React from "react";

export interface NextFunctionComponent<Props> extends React.FC<Props> {
  getInitialProps?: any;
}

export type NextFunctionComponentWithAuth<Props = {}> = NextFunctionComponent<
  Props & { me?: any }
>;

export interface ApolloContext {
  req: any;
  query: any;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

type Maybe<T> = T | null;

export interface NextContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}
