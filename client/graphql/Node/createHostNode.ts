import gql from "graphql-tag";

export const CreateHostNodeMutation = gql`
    mutation CreateHostNodeMutation(
        $name: String!
        $loginName: String!
        $password: String!
    ) {
        createNode(
            data: { name: $name, loginName: $loginName, password: $password }
        ) {
            id
        }
    }
`;
