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
}