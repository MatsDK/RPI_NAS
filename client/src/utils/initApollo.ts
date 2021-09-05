import { ApolloClient, InMemoryCache } from "apollo-boost";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";

let apolloClient: any = null;

interface Options {
  getToken: () => string;
}

const create = (
  initialState: any,
  { getToken }: Options,
  linkOptions: HttpLink.Options
) => {
  const httpLink = createHttpLink({
    ...linkOptions,
    headers: { Cookie: getToken() },
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: httpLink,
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

const initApollo = (
  initialState: any,
  options: Options,
  linkOptions: HttpLink.Options
) => {
  if (!isBrowser) return create(initialState, options, linkOptions);

  if (!apolloClient) apolloClient = create(initialState, options, linkOptions);

  return apolloClient;
};

export default initApollo;
