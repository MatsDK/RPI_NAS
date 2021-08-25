import { useRouter } from "next/dist/client/router";
import React from "react";
import Tree from "lib/components/Tree";
import FolderItems from "lib/components/Folder";
import { ApolloContext } from "types/types";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { getTreeQuery } from "graphql/TreeObject/queryTree";

const Folder = () => {
  const router = useRouter(),
    path = ((router.query.path || []) as string[]).join("/");

  return (
    <div style={{ display: "flex" }}>
      <Tree />

      <FolderItems path={path} />
    </div>
  );
};

Folder.getInitialProps = async (ctx: ApolloContext) => {
  const { loading, data } = await ctx.apolloClient.query({
    query: getDirectoryTreeQuery,
    variables: {
      depth: 1,
      path: "/",
    },
  });

  await ctx.apolloClient.query({
    query: getTreeQuery,
    variables: {
      depth: 1,
      path: (ctx as any).query.path.join("/"),
    },
  });

  if (loading) return { tree: null };

  return { tree: data.tree };
};

export default Folder;
