import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class SizeObject {
	@Field()
	usedSize: number;

	@Field()
	usedPercent: number;
}

@InputType()
export class GetDatastoreSizesInput {
	@Field()
	id: number

	@Field()
	path: string

	size?: SizeObject
}

@ObjectType()
export class GetDatastoreSizes {
	@Field()
	id: number

	@Field()
	path: string

	@Field({ nullable: true })
	size: SizeObject;
}