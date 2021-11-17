import { UploadProfilePictureMutation } from "graphql/User/UploadProfilePicture";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useApollo } from "src/hooks/useApollo";
import { Layout } from "./Layout";
import fsPath from "path";
import { useMeState } from "src/hooks/useMeState";
import styled from "styled-components";

interface ProfileViewProps {}

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: contain;
  box-shadow: 1px 1px 5px #00000034;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  max-width: 700px;
  max-height: 200px;
  width: 60vw;
  padding: 20px 50px;
`;

const UserInfo = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: baseline;
`;

const UserName = styled.div`
  font-size: 35px;
  font-weight: 600;
  color: ${(props) => props.theme.textColors[0]};
  margin-bottom: -5px;
`;

const UserEmail = styled.div`
  font-size: 18px;
  color: ${(props) => props.theme.textColors[1]};
`;

export const ProfileView: React.FC<ProfileViewProps> = ({}) => {
  const { me } = useMeState();
  const { mutate } = useApollo();

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setImageSrc(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${
        me?.id
      }?${new Date().getTime()}`
    );
  }, [me]);

  const onDrop = useCallback(async ([file]) => {
    if (!file) return;

    if (fsPath.extname(file.name) != ".png") return alert("not a png");

    const { errors } = await mutate(UploadProfilePictureMutation, { file });

    if (errors) return console.log(errors);

    setImageSrc(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${
        me?.id
      }?${new Date().getTime()}`
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/png",
  });

  return (
    <Layout showHomeButton={true}>
      <Container>
        <div
          {...getRootProps({
            className: "dropzone",
          })}
        >
          <input {...getInputProps()} />
          <ProfilePicture src={imageSrc} />
        </div>
        <UserInfo>
          <UserName>{me?.userName}</UserName>
          <UserEmail>{me?.email}</UserEmail>
        </UserInfo>
      </Container>
    </Layout>
  );
};
