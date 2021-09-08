export interface NextFunctionComponent<Props> extends React.FC<Props> {
  getInitialProps?: any;
}

export interface ApolloContext {
  req: any;
  query: any;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

type Maybe<T> = T | null;
