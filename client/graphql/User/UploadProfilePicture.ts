import gql from "graphql-tag";

export const UploadProfilePictureMutation = gql`
  mutation Upload($file: Upload!) {
    UploadProfilePicture(file: $file)
  }
`;
