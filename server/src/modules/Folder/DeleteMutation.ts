import { gql } from "@apollo/client/core";

export const DeleteMutation = gql`
mutation DeleteMutation($paths: [DeletePaths!]!) {
	delete(paths: $paths)
}
`