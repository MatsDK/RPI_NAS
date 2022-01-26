import { InputType, Field } from "type-graphql";
import { Node } from "./Node";

@InputType()
class CopyMovePath {
	@Field()
	local: string

	@Field()
	remote: string
}

@InputType()
export class CopyAndMoveInput {
	@Field()
	type: string

	@Field()
	remote: boolean

	@Field(() => Node)
	srcNode: Node

	@Field(() => [CopyMovePath])
	downloadDirectories: CopyMovePath[]

	@Field(() => [CopyMovePath])
	downloadFiles: CopyMovePath[]
}