import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Node extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int")
  id: number;

  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column("text")
  ip: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  host: string;
}
