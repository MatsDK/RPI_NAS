import { Wrapper } from ".";
import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import FolderItems from "src/components/Folder/Folder";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";

interface Props {
  tree: any;
}

const Folder: NextFunctionComponentWithAuth<Props> = ({ me, tree }) => {
  useMeState(me);

  const [datastoreName, setDatastoreName] = useState<string>("");

  const router = useRouter(),
    path = ((router.query.path || []) as string[]).join("/"),
    datastoreId = router?.query?.d ? Number(router.query.d) : null;

  if (datastoreId == null) return null;

  useEffect(() => {
    setDatastoreName(
      tree?.directoryTree?.tree?.find((d) => d.datastoreId == datastoreId)
        ?.name || ""
    );
  }, [path, datastoreId]);

  return (
    <Layout title={`${datastoreName || "Datastore"} - ${path}`}>
      <SideBar />
      <Wrapper>
        <Tree />
        <FolderItems
          path={path}
          datastoreId={datastoreId}
          datastoreName={datastoreName}
        />
      </Wrapper>
    </Layout>
  );
};

Folder.getInitialProps = async (ctx: ApolloContext) => {
  const path = ctx.query.path.join("/"),
    datastoreId = ctx.req
      ? ctx.req?.query?.d
        ? Number(ctx.req.query.d)
        : null
      : ctx?.query?.d
        ? Number(ctx.query?.d)
        : null;

  const res = await ctx.apolloClient.query({
    query: getDirectoryTreeQuery,
    variables: {
      depth: 1,
      path: "/",
      datastoreId: null,
    },
  });

  await ctx.apolloClient.query({
    query: getTreeQuery,
    variables: {
      depth: 1,
      path,
      datastoreId,
    },
  });

  return { tree: res.data };
};

export default withAuth(Folder);
