import { InputType, Field } from "type-graphql"

@InputType()
export class AcceptNodeRequestInput {
	@Field()
	id: number

	@Field()
	name: string

	@Field()
	loginName: string

	@Field()
	password: string
}
