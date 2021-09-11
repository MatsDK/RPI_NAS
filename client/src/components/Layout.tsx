import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const PageBody = styled.div`
  display: flex;
  height: 100%;
`;

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Navbar />
      <PageBody>{children}</PageBody>
    </div>
  );
};

export { Layout };
