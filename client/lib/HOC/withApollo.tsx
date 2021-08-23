import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import { getDataFromTree } from "react-apollo";
import initApollo from "../utils/initApollo";
import { isBrowser } from "../utils/isBrowser";

const docExists = () => typeof document !== "undefined";

const withApollo = (App: any) => {
  return class WithData extends React.Component {
    static propTypes = {
      apolloState: PropTypes.object.isRequired,
    };

    static async getInitialProps(ctx: any) {
      const {
        Component,
        router,
        ctx: { req, res },
      } = ctx;

      const apollo = initApollo(
        {},
        {
          getToken: () => req.headers.cookie || "",
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }
      );

      ctx.ctx.apolloClient = { ...apollo };

      let appProps = {};
      if (App.getInitialProps) appProps = await App.getInitialProps(ctx);

      if (res && res.finished) return {};

      if (!isBrowser) {
        try {
          await getDataFromTree(
            <App
              {...appProps}
              Component={Component}
              router={router}
              apolloClient={apollo}
            />
          );
        } catch (error) {
          // console.error("Error while running `getDataFromTree`", error);
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo's store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      };
    }

    apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(props: any) {
      super(props);

      this.apolloClient = initApollo(
        props.apolloState,
        {
          getToken: () => {
            return docExists() ? document.cookie : "";
          },
        },
        {
          uri: "http://localhost:4000/graphql",
          credentials: "include",
        }
      );
    }

    render() {
      return <App {...this.props} apolloClient={{ ...this.apolloClient }} />;
    }
  };
};

export default withApollo;
