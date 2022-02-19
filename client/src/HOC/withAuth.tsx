import { meQuery } from "graphql/User/me";
import Router from "next/router";
import React from "react";
import { redirectToLogin } from "src/utils/redirect";
import { NextContextWithApollo, NextFunctionComponent } from "types/types";
import { MeQuery, User } from "../../generated/apolloComponents";

export const withAuth = <T extends object>(
  Component: NextFunctionComponent<T>,
  validateFn: (me: User) => boolean = () => true
) =>
  class AuthComponent extends React.Component<T & { me?: User }> {
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

        if (!validateFn(response.data.me))
          return Router.back()

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
      if (!this.props.me || !validateFn(this.props.me as User)) {
        Router.push("/login");
        return null;
      }

      return <Component {...this.props} />;
    }
  };
