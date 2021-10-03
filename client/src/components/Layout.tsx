import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const PageBody = styled.div`
  display: flex;
  height: 100%;

  background-color: ${(props) => props.theme.lightBgColors[0]};
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
