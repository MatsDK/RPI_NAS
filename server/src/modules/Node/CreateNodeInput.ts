import { InputType, Field } from "type-graphql"

@InputType()
export class CreateNodeInput {
	@Field()
	name: string

	@Field()
	loginName: string

	@Field()
	password: string
}
