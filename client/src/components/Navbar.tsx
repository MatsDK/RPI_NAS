import React from "react";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";

const NavBar = styled.div`
  width: 100vw;
  height: 65px;
  background-color: ${(props) => props.theme.bgColors[0]};
  color: ${(props) => props.theme.textColors[3]};
`;

const Navbar = () => {
  const { me } = useMeState();

  return (
    <NavBar>
      {me?.userName}
      {me?.isAdmin && "ADMIN"}
    </NavBar>
  );
};

export default Navbar;
