import { getDirectoryTreeQuery } from "graphql/TreeObject/queryDirectoryTree";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useState } from "react";
import Folder from "src/components/Folder/Folder";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";

interface Props {
  tree: any;
}

const Page: NextFunctionComponentWithAuth<Props> = ({ me, tree }) => {
  useMeState(me);

  const [dataStoreName, setDataStoreName] = useState<string>("");

  const router = useRouter(),
    dataStoreId = router?.query?.d ? Number(router.query.d) : null;

  if (dataStoreId == null) return null;

  useEffect(() => {
    setDataStoreName(
      tree?.directoryTree?.tree?.find((d) => d.dataStoreId == dataStoreId)
        ?.name || ""
    );
  }, [dataStoreId]);

  return (
    <Layout>
      <SideBar />
      <div style={{ display: "flex", width: "100%" }}>
        <Tree />
        <Folder
          path={""}
          dataStoreId={Number(router.query.d)}
          dataStoreName={dataStoreName}
        />
      </div>
    </Layout>
  );
};

Page.getInitialProps = async (ctx: ApolloContext) => {
  const dataStore = ctx.req
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
      dataStoreId: null,
    },
  });

  await ctx.apolloClient.query({
    query: getTreeQuery,
    variables: {
      depth: 1,
      path: "",
      dataStoreId: dataStore,
    },
  });

  return { tree: res.data };
};

export default withAuth(Page);
