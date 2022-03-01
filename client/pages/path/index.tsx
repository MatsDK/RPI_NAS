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
import styled from "styled-components";
import { ApolloContext, NextFunctionComponentWithAuth } from "types/types";

interface Props {
  tree: any;
}

export const Wrapper = styled.div`
  display: flex;
  width: calc(100vw - 70px);
`;

const Page: NextFunctionComponentWithAuth<Props> = ({ me, tree }) => {
  useMeState(me);

  const [dataStoreName, setDataStoreName] = useState<string>("");

  const router = useRouter(),
    dataStoreId = router?.query?.d ? Number(router.query.d) : null;

  if (dataStoreId == null) return null;

  useEffect(() => {
    setDataStoreName(
      tree?.directoryTree?.tree?.find((d) => d.datastoreId == dataStoreId)
        ?.name || ""
    );
  }, [dataStoreId]);

  return (
    <Layout title={dataStoreName || "Datatstore"}>
      <SideBar />
      <Wrapper>
        <Tree />
        <Folder
          path=""
          datastoreId={Number(router.query.d)}
          datastoreName={dataStoreName}
        />
      </Wrapper>
    </Layout>
  );
};

Page.getInitialProps = async (ctx: ApolloContext) => {
  const datastoreId = ctx.req
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
      path: "",
      datastoreId
    },
  });

  return { tree: res.data };
};

export default withAuth(Page);
