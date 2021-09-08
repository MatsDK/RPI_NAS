import { ApolloClient, ApolloLink, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { createHttpLink, HttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";
import cookieCutter from "cookie-cutter";

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
    credentials: "include",
  });

  const authLink = setContext((_, { headers = {} }) => {
    const token = getToken() || "";

    headers.authorization = token;

    return {
      headers,
    };
  });

  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext(),
        cookies = context.response.headers.get("Cookie");

      if (cookies && isBrowser) {
        const parsedCookies = cookies
          .split(";")
          .map((v: string) => v.split("="));

        for (const [name, value] of parsedCookies) {
          cookieCutter.set(name.trim(), value.trim());
        }
      }

      return response;
    });
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([afterwareLink.concat(authLink.concat(httpLink))]),
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
