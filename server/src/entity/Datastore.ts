import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Datastore extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int")
  id: number;

  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column("int")
  userId: number;

  @Field()
  @Column("int")
  localHostNodeId: number;

  @Field()
  @Column("int")
  localNodeId: number;

  @Field()
  @Column("text")
  basePath: string;
}
