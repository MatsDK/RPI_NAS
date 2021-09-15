import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Datastore extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int", { generated: true })
  id: number;

  @Field()
  @Column("text", { unique: true })
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

  @Field(() => [User])
  sharedUsers: User[];

  @Field(() => User, { nullable: true })
  owner: User;
}
