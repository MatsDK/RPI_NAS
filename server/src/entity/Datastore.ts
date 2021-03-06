import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
export class SizeObject {
  @Field()
  usedSize: number;

  @Field()
  usedPercent: number;
}

export enum DatastoreStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  INIT = "init",
}

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

  @Field({ nullable: true })
  @Column("int", { nullable: true })
  sizeInMB: number;

  @Field({ nullable: true })
  size?: SizeObject;

  @Column({
    type: "enum",
    enum: DatastoreStatus,
    default: DatastoreStatus.INIT,
  })
  @Field(() => String)
  status: DatastoreStatus;

  @Column("int", { array: true, default: [] })
  @Field(() => [Number])
  allowedSMBUsers: number[];

  @Field(() => [User])
  sharedUsers: User[];

  @Field(() => User, { nullable: true })
  owner: User;

  @Field(() => Boolean, { nullable: true })
  userInitialized: boolean;

  @Field(() => String, { nullable: true })
  smbConnectString?: string;
}
