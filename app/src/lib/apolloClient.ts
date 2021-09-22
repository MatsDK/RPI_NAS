import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client";
import { setContext } from "apollo-link-context";

const GRAPHQL_ENDPOINT = "http://192.168.0.209:4000/graphql";

const apolloClient = () => {
  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  const authLink = setContext((_, { headers }) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMjMyNDQzOCwiZXhwIjoxNjMyMzI1MzM4fQ.eDdvaixNkR6UY85uyG2H3-mEUVvdccwxW5aXUbC9pJ0";

    return {
      headers: {
        ...headers,
        authorization: token ? `access-token=${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(link as any) as any,
    cache: new InMemoryCache(),
  });
};

export default apolloClient;
