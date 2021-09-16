import Link from "next/link";
import React from "react";
import styled from "styled-components";

const SideBar = styled.div`
  height: 100%;
  width: 70px;
  background-color: ${(props) => props.theme.bgColors[0]};
  border-top: 2px solid ${(props) => props.theme.bgColors[2]};
`;

const sideBar = () => {
  return (
    <SideBar>
      <Link href={"/"}>Files</Link>
      <Link href={"/datastores"}>DataStores</Link>
    </SideBar>
  );
};

export default sideBar;
