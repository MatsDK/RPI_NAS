import { Field, ID, InputType, ObjectType } from "type-graphql";

@InputType()
export class Node {
	@Field(() => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	ip: string;

	@Field()
	loginName: string;

	@Field()
	password: string;

	@Field()
	port: number;

	@Field(() => Number)
	sshPort?: number;

	@Field()
	basePath: string;

	@Field()
	hostNode: boolean;

	@Field(() => String, { nullable: true })
	token?: string;

	@Field(() => [Number])
	initializedUsers: number[]
}
