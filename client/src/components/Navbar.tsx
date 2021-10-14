import React, { useState } from "react";
import { ProfileButton } from "src/ui/ProfilePicture";
import Link from "next/link";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";
import { useRouter } from "next/router";

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
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Navbar = () => {
  const { me } = useMeState();

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <NavBar>
      <UserData>
        <UserInfo onClick={() => setShowDropdown((s) => !s)}>
          {me && (
            <ProfileButton
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me.id}`}
            />
          )}
        </UserInfo>
        {showDropdown && <UserDropDown />}
      </UserData>
    </NavBar>
  );
};

const UserDropdownWrapper = styled.div`
  position: absolute;
  top: 65px;
  background-color: ${(props) => props.theme.lightBgColors[0]};
  min-width: 150px;
  border-radius: 1px;
  right: 0;
  padding: 4px;
  color: ${(props) => props.theme.bgColors[1]};
  box-shadow: 0 24px 54px rgb(0 0 0 / 15%), 0 4.5px 13.5px rgb(0 0 0 / 8%);
`;

const UserDropDown: React.FC = () => {
  const router = useRouter();

  return (
    <UserDropdownWrapper>
      <Link href="/profile">
        <p>Profile</p>
      </Link>
      <div onClick={() => router.push("/logout ")}>logout</div>
    </UserDropdownWrapper>
  );
};

export default Navbar;
