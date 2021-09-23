import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { AsyncStorage } from "react-native";
import { setContext } from "apollo-link-context";

const GRAPHQL_ENDPOINT = "http://192.168.0.209:4000/graphql";

const apolloClient = () => {
  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    return AsyncStorage.getItem("access-token").then((access) => {
      return AsyncStorage.getItem("refresh-token").then((refresh) => {
        return {
          headers: {
            ...headers,
            authorization: `${access && `access-token=${access}`}; ${
              refresh && `refresh-token=${refresh}`
            }`,
          },
        };
      });
    });
  });

  const afterware = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const res = operation.getContext(),
        cookies = res.response.headers.get("cookie");

      if (cookies) {
        const parsedCookies: Array<string[]> = cookies
          .split(";")
          .map((v: string) => v.split("="));

        for (const [name, value] of parsedCookies)
          AsyncStorage.setItem(name.trim(), value.trim());
      }

      return response;
    });
  });

  return new ApolloClient({
    link: afterware.concat(authLink.concat(link as any) as any),
    cache: new InMemoryCache(),
  });
};

export default apolloClient;
