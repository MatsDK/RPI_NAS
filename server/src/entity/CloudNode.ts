import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class Node extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int", { generated: true })
  id: number;

  @Field()
  @Column("text", { unique: true })
  name: string;

  @Field()
  @Column("text", { unique: true })
  ip: string;

  @Field()
  @Column("text")
  loginName: string;

  @Field()
  @Column("text")
  password: string;

  @Field()
  @Column("int")
  port: number;

  @Field(() => Number)
  @Column("int", { default: 22 })
  sshPort?: number;

  @Field()
  @Column("text")
  basePath: string;

  @Field()
  @Column("bool", { default: false })
  hostNode: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  token?: string;

  @Field(() => [Number])
  @Column("int", { array: true, default: [] })
  initializedUsers: number[]

  @Field(() => Boolean)
  pingResult?: boolean
}
