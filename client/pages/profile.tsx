import React, { useCallback } from "react";
import fsPath from "path";
import { Layout } from "src/components/Layout";
import { withAuth } from "src/HOC/withAuth";
import { useMeState } from "src/hooks/useMeState";
import { NextFunctionComponentWithAuth } from "types/types";
import { useDropzone } from "react-dropzone";
import { UploadProfilePictureMutation } from "graphql/User/UploadProfilePicture";
import { useApollo } from "src/hooks/useApollo";

interface ProfileProps {}

const Profile: NextFunctionComponentWithAuth<ProfileProps> = ({ me }) => {
  useMeState(me);
  const { mutate } = useApollo();

  const onDrop = useCallback(async ([file]) => {
    if (!file) return;

    if (fsPath.extname(file.name) != ".png") return alert("not a png");

    const { errors } = await mutate(UploadProfilePictureMutation, { file });

    if (errors) return console.log(errors);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/png",
  });

  return (
    <Layout showHomeButton={true}>
      profile
      <div
        {...getRootProps({
          className: "dropzone",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </Layout>
  );
};

export default withAuth(Profile);
