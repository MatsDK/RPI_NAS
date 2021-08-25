export interface NextFunctionComponent<Props> extends React.FC<Props> {
  getInitialProps?: any;
}

export interface ApolloContext {
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

type Maybe<T> = T | null;
