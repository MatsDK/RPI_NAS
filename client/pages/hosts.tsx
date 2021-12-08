import React from "react";
import { Layout } from "src/components/Layout";
import SideBar from "src/components/SideBar";

interface hostsProps {}

const Hosts: React.FC<hostsProps> = ({}) => {
  return (
    <Layout>
      <SideBar />
      <h1>Hosts</h1>
    </Layout>
  );
};

export default Hosts;
