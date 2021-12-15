import { InputType, Field } from "type-graphql";

@InputType()
export class SetupNodeInput {
	@Field()
	id: number

	@Field()
	name: string

	@Field()
	ip: string

	@Field()
	loginName: string

	@Field()
	password: string

	@Field()
	port: number

	@Field()
	host: string

	@Field()
	basePath: string

	@Field()
	hostNode: boolean

	@Field()
	token: string
}
