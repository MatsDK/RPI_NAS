import React from "react";
import styled from "styled-components";
import { ProfilePicture } from "./ProfilePicture";

interface ProfilePicturesStackProps {
  users: { id: number; userName: string }[];
}

const StackUser = styled.div`
  position: relative;

  > span {
    position: absolute;
    margin-top: 45px;
    transition: 0.15s ease-in-out;
    opacity: 0;
    pointer-events: none;
    left: 5px;
    background-color: ${(props) => props.theme.bgColors[1]};
    padding: 0 5px;
    border-radius: 3px;
    color: ${(props) => props.theme.textColors[3]};
  }
  :hover > span {
    opacity: 1;
    margin-top: 35px;
  }
`;

export const ProfilePicturesStack: React.FC<ProfilePicturesStackProps> = ({
  users,
}) => (
  <div>
    {users.slice(0, 5).map(({ id, userName }, idx) => (
      <StackUser
        key={idx}
        style={{ zIndex: 50 - idx, marginLeft: idx != 0 ? -15 : 0 }}
      >
        <ProfilePicture
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${id}`}
        />
        <span>{userName}</span>
      </StackUser>
    ))}
    {users.length > 5 && <div>+{users.length - 5}</div>}
  </div>
);
