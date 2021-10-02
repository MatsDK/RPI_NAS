import { logoutMutation } from "graphql/User/logout";
import { NextContextWithApollo } from "types/types";
import { redirect } from "src/utils/redirect";

const Logout = (): null => {
  return null;
};

Logout.getInitialProps = async ({
  apolloClient,
  ...ctx
}: NextContextWithApollo) => {
  await apolloClient.mutate({ mutation: logoutMutation });
  await apolloClient.resetStore();
  redirect(ctx, "/login");
  return {};
};

export default Logout;
