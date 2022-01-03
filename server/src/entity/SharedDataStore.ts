import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class SharedDataStore extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int", { generated: true })
  id: number;

  @Field()
  @Column("int")
  userId: number;

  @Field()
  @Column("int")
  dataStoreId: number;

  @Field()
  @Column()
  initialized: boolean;
}
