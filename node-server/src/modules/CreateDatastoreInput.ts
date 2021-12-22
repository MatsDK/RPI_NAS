import { InputType, Field } from "type-graphql";

@InputType()
export class CreateDatastoreInput {
	@Field()
	path: string

	@Field()
	groupName: string

	@Field()
	sizeInMB: number

	@Field()
	ownerUserName: string

	@Field()
	ownerPassword: string

	@Field()
	initOwner: boolean

	@Field()
	hostLoginName: string
}