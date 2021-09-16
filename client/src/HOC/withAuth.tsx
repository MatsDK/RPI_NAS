import { meQuery } from "graphql/User/me";
import React from "react";
import { redirectToLogin } from "src/utils/redirect";
import { NextContextWithApollo, NextFunctionComponent } from "types/types";
import { MeQuery } from "../../generated/apolloComponents";

export const withAuth = <T extends object>(
  Component: NextFunctionComponent<T>
) =>
  class AuthComponent extends React.Component<T> {
    static async getInitialProps({
      apolloClient,
      ...ctx
    }: NextContextWithApollo) {
      try {
        const response = await apolloClient.query<MeQuery>({
          query: meQuery,
        });

        if (!response || !response.data || !response.data.me)
          return redirectToLogin(ctx);

        let appProps = {};
        if (Component.getInitialProps)
          appProps = await Component.getInitialProps({ ...ctx, apolloClient });

        return {
          me: response.data.me,
          ...appProps,
        };
      } catch {
        return redirectToLogin(ctx);
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
