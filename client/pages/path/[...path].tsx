import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useRouter } from "next/dist/client/router";
import React from "react";
import FolderItems from "src/components/Folder/Folder";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";

const Folder: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  const router = useRouter(),
    path = ((router.query.path || []) as string[]).join("/"),
    dataStoreId = router?.query?.d ? Number(router.query.d) : null;

  if (!dataStoreId) return null;

  return (
    <Layout>
      <SideBar />
      <div style={{ display: "flex" }}>
        <Tree />
        <FolderItems path={path} dataStoreId={dataStoreId} />
      </div>
    </Layout>
  );
};

Folder.getInitialProps = async (ctx: ApolloContext) => {
  const path = ctx.query.path.join("/"),
    dataStore = ctx.req
      ? ctx.req?.query?.d
        ? Number(ctx.req.query.d)
        : null
      : ctx?.query?.d
      ? Number(ctx.query?.d)
      : null;

  await ctx.apolloClient.query({
    query: getDirectoryTreeQuery,
    variables: {
      depth: 1,
      path: "/",
      dataStoreId: null,
    },
  });

  await ctx.apolloClient.query({
    query: getTreeQuery,
    variables: {
      depth: 1,
      path,
      dataStoreId: dataStore,
    },
  });

  return { tree: null };
};

export default withAuth(Folder);
