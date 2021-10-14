import styled from "styled-components";

export const ProfilePicture = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: contain;
  box-shadow: 1px 1px 5px #00000034;
`;

export const ProfileButton = styled(ProfilePicture)`
  width: 35px;
  height: 35px;
`;
