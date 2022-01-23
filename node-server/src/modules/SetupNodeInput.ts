import { InputType, Field } from "type-graphql";

@InputType()
export class Node {
	@Field()
	id: number;

	@Field()
	loginName: string;

	@Field()
	password: string;

	@Field()
	token: string;
}
