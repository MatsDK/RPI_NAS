import { Field, InputType } from "type-graphql";

type Type = "file" | "directory"

@InputType()
export class DeletePaths {
	@Field()
	path: string;

	@Field(() => String)
	type: Type;
}