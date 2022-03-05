import { gql } from "@apollo/client/core";


export const SETUPNODE_MUTATION = gql`
mutation SetupNodeMutation($data: SetupNodeInput!) {
	setupNode(data: $data)
}
`