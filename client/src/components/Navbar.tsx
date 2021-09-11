import React from "react";
import styled from "styled-components";

const NavBar = styled.div`
  width: 100vw;
  height: 65px;
  background-color: ${(props) => props.theme.bgColors[0]};
`;

const Navbar = () => {
  return <NavBar></NavBar>;
};

export default Navbar;
