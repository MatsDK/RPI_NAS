import gql from "graphql-tag";

export const UpdateOwnershipMutation = gql`
mutation UpdateOwnership($datastoreId: Float!) {
  updateOwnership(datastoreId: $datastoreId)
}

`