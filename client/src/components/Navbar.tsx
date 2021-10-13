import React from "react";
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

const ProfilePicture = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: contain;
`;

const Navbar = () => {
  const { me } = useMeState();
  const router = useRouter();

  return (
    <NavBar>
      <UserData>
        <UserInfo>
          <Link href="/profile">
            <p>{me?.userName}</p>
          </Link>
          <span>{me?.isAdmin && "Admin"}</span>
        </UserInfo>
        {me && (
          <ProfilePicture
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me.id}`}
          />
        )}
        {me && <div onClick={() => router.push("/logout ")}>logout</div>}
      </UserData>
    </NavBar>
  );
};

export default Navbar;
