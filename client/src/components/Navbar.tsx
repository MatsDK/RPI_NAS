import React from "react";
import Link from "next/link";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";

const NavBar = styled.div`
  width: 100vw;
  height: 65px;
  background-color: ${(props) => props.theme.bgColors[0]};
  color: ${(props) => props.theme.textColors[3]};
  display: flex;
`;

const UserData = styled.div`
  padding: 0 10px;
  margin-left: auto;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColors[3]};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  p {
    font-size: 18px;
    font-weight: 600;
  }

  span {
    color: ${(props) => props.theme.lightBgColors[2]};
    font-size: 13px;
  }
`;

const Navbar = () => {
  const { me } = useMeState();

  return (
    <NavBar>
      <UserData>
        <UserInfo>
          <p>{me?.userName}</p>
          <span>{me?.isAdmin && "Admin"}</span>
        </UserInfo>
        {me && <Link href={"/logout"}>logout</Link>}
      </UserData>
    </NavBar>
  );
};

export default Navbar;
