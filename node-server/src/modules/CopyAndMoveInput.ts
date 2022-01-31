import { InputType, Field } from "type-graphql";
import { Node } from "./Node";

@InputType()
class CopyMovePath {
	@Field()
	local: string

	@Field()
	remote: string

	@Field()
	type: string
}

@InputType()
export class CopyAndMoveInput {
	@Field()
	type: string

	@Field()
	nodeLoginName: string

	@Field()
	datastoreName: string

	@Field()
	datastoreBasePath: string

	@Field()
	remote: boolean

	@Field(() => Node)
	srcNode: Node

	@Field()
	srcDatastoreId: number

	@Field(() => [CopyMovePath])
	downloadDirectories: CopyMovePath[]

	@Field(() => [CopyMovePath])
	downloadFiles: CopyMovePath[]
}