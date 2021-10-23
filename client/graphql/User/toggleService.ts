import gql from "graphql-tag";

export const ToggleServiceMutation = gql`
  mutation ToggleServiceMutation($serviceName: String!) {
    toggleService(serviceName: $serviceName)
  }
`;
