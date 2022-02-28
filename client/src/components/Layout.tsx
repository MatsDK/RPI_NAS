import Head from "next/head";
import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const PageBody = styled.div`
  display: flex;
  width: 100vw;
  height: 100%;
  background-color: ${(props) => props.theme.lightBgColors[0]};
`;

interface Props {
  title?: string
  showHomeButton?: boolean;
}

const Layout: React.FC<Props> = ({ children, showHomeButton = false, title = "exaNAS" }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/icon3.png" />
      </Head>
      <Navbar showHomeButton={showHomeButton} />
      <PageBody>{children}</PageBody>
    </div>
  );
};

export { Layout };
