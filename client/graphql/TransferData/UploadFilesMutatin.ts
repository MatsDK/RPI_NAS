import gql from "graphql-tag";

export const UploadFilesMutation = gql`
mutation UploadFiles($path: String!, $datastoreId: Float!, $files: [Upload!]!) {
  uploadFiles(path: $path, datastoreId: $datastoreId, files: $files)
}

`