import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";

const PageBody = styled.div`
  display: flex;
  height: 100%;

  background-color: ${(props) => props.theme.lightBgColors[0]};
`;

interface Props {
  showHomeButton?: boolean;
}

const Layout: React.FC<Props> = ({ children, showHomeButton = false }) => {
  return (
    <div>
      <Navbar showHomeButton={showHomeButton} />
      <PageBody>{children}</PageBody>
    </div>
  );
};

export { Layout };
