import { InputType, Field } from "type-graphql";

@InputType()
export class SetupNodeInput {
	@Field()
	id: number;

	@Field()
	loginName: string;

	@Field()
	password: string;

	@Field()
	token: string;
}
