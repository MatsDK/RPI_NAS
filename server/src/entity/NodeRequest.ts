import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class NodeRequest extends BaseEntity {
	@Field()
	@PrimaryColumn({ generated: true })
	id: number

	@Field()
	@Column()
	ip: string

	@Field()
	@Column()
	port: number
}
