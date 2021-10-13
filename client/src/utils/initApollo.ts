import { ApolloClient, ApolloLink, InMemoryCache } from "apollo-boost";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { isBrowser } from "./isBrowser";
import cookieCutter from "cookie-cutter";
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from "./constants";
import { createUploadLink } from "apollo-upload-client";

let apolloClient: any = null;

interface Options {
  getToken: () => string;
}

const create = (
  initialState: any,
  { getToken }: Options,
  linkOptions: HttpLink.Options
) => {
  const uploadLink = createUploadLink({
    uri: linkOptions.uri as any,
    credentials: linkOptions.credentials,
  });

  const authLink = setContext((_, { headers = {} }) => ({
    headers: {
      ...headers,
      authorization: getToken() || "",
    },
  }));

  const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const context = operation.getContext(),
        cookies = context.response.headers.get("Cookie");

      if (cookies && isBrowser) {
        const parsedCookies: Array<string[]> = cookies
          .split(";")
          .map((v: string) => v.split("="));

        for (const [name, value] of parsedCookies) {
          cookieCutter.set(name.trim(), value.trim(), {
            expires: getExpiresDate(name.trim() as CookieNames),
            path: "/",
          });
        }
      }

      return response;
    });
  });

  const createLink = (link: ApolloLink) =>
    ApolloLink.from([afterwareLink.concat(authLink.concat(link))]);

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: createLink(uploadLink as any),
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

type CookieNames = "refresh-token" | "access-token";

const getExpiresDate = (cookieName: CookieNames): Date | undefined => {
  let currDate = new Date().getTime();

  if (cookieName === "access-token") currDate += MAX_AGE_ACCESS_TOKEN;
  else if (cookieName === "refresh-token") currDate += MAX_AGE_REFRESH_TOKEN;
  else return undefined;

  return new Date(currDate);
};
