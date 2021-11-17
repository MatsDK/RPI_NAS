import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useDropdown } from "src/hooks/useDropdown";
import { useMeState } from "src/hooks/useMeState";
import { LightButton } from "src/ui/Button";
import { NavbarIcon } from "src/ui/NavbarIcon";
import { LargeProfilePicture, ProfileButton } from "src/ui/ProfilePicture";
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
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const NavBarLeft = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

interface Props {
  showHomeButton: boolean;
}

const Navbar: React.FC<Props> = ({ showHomeButton }) => {
  const { me } = useMeState();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef: any = useRef();

  useDropdown(dropdownRef, () => showDropdown && setShowDropdown(false));

  return (
    <NavBar>
      <Link href={"/"}>
        <NavBarLeft>
          <NavbarIcon />
          {showHomeButton ? <LightButton>Home</LightButton> : <div />}
        </NavBarLeft>
      </Link>
      <UserData>
        <UserInfo onClick={() => setShowDropdown((s) => !s)}>
          {me && (
            <ProfileButton
              src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me?.id}`}
            />
          )}
        </UserInfo>
        <UserDropdownWrapper
          style={{
            opacity: showDropdown ? 1 : 0,
            pointerEvents: showDropdown ? "all" : "none",
          }}
          ref={dropdownRef}
        >
          <UserDropDown />
        </UserDropdownWrapper>
      </UserData>
    </NavBar>
  );
};

const UserDropdownWrapper = styled.div`
  position: absolute;
  top: 65px;
  background-color: ${(props) => props.theme.lightBgColors[0]};
  min-width: 300px;
  border-radius: 1px;
  right: 0;

  padding: 10px;
  color: ${(props) => props.theme.bgColors[1]};
  box-shadow: 0 24px 54px rgb(0 0 0 / 15%), 0 4.5px 13.5px rgb(0 0 0 / 8%);

  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
`;

const Btn = styled.p`
  cursor: pointer;
  color: ${(props) => props.theme.textColors[1]};
  transition: 0.15s ease-in-out;

  :hover {
    color: ${(props) => props.theme.textColors[0]};
  }
`;

const Names = styled.div`
  display: flex;
  flex-direction: column;

  span:first-child {
    font-weight: 500;
    color: ${(props) => props.theme.textColors[0]};
    font-size: 20px;
  }

  span:last-child {
    margin-top: -2px;
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const UserDropDown: React.FC = () => {
  const router = useRouter();
  const { me } = useMeState();

  return (
    <>
      <LargeProfilePicture
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me?.id}`}
      />
      <div style={{ flex: 1 }}>
        <Names>
          <span>{me?.userName}</span>
          <span>{me?.email}</span>
        </Names>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Link href="/profile">
            <Btn>My Profile</Btn>
          </Link>
          <Btn onClick={() => router.push("/logout ")}>Sign out</Btn>
        </div>
      </div>
    </>
  );
};

export default Navbar;
