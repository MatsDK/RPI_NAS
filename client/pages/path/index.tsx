import { useRouter } from "next/dist/client/router";
import React from "react";
import Folder from "src/components/Folder/Folder";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";
import Tree from "src/components/Tree/Tree";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { NextFunctionComponentWithAuth } from "types/types";

const Page: NextFunctionComponentWithAuth = ({ me }) => {
  useMeState(me);

  const router = useRouter();
  if (!router.query.d) return null;

  return (
    <Layout>
      <SideBar />
      <div style={{ display: "flex", width: "100%" }}>
        <Tree />
        <Folder path={""} dataStoreId={Number(router.query.d)} />
      </div>
    </Layout>
  );
};

export default withAuth(Page);
