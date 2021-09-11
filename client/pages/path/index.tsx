import React from "react";
import Tree from "src/components/Tree/Tree";
import Folder from "src/components/Folder/Folder";
import { useRouter } from "next/dist/client/router";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";

const index = () => {
  const router = useRouter();
  if (!router.query.d) return null;

  return (
    <Layout>
      <SideBar />
      <div style={{ display: "flex" }}>
        <Tree />
        <Folder path={""} dataStoreId={Number(router.query.d)} />
      </div>
    </Layout>
  );
};

export default index;
