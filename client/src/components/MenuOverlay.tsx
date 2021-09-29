import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100vh;
  width: 35vw;
  min-width: 500px;
  max-width: 40vw;
  background-color: ${(props) => props.theme.bgColors[0]};
  z-index: 100;
  color: ${(props) => props.theme.textColors[3]};
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
  background-color: #00000060;
`;

interface Props {
  hide: () => any;
}

const MenuOverlay: React.FC<Props> = ({ children, hide }) => {
  return (
    <BackgroundOverlay onClick={(e) => e.currentTarget == e.target && hide()}>
      <Overlay>{children}</Overlay>
    </BackgroundOverlay>
  );
};

export default MenuOverlay;
