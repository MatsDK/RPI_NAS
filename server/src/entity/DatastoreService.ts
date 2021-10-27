import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

export enum ServiceNames {
	SMB = "SMB",
}

@ObjectType()
@Entity()
export class DatastoreService extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
	  type: "enum",
	  enum: ServiceNames,
  })
  @Field()
  serviceName: ServiceNames;

  @Column()
  @Field()
  userId: number;

  @Column()
  @Field()
  datastoreId: number;
}

