import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, In, PrimaryColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn("int", { generated: true })
  id: number;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  @Column("text", { unique: true })
  userName: string;

  @Field()
  @Column("text", { unique: true })
  osUserName: string;

  @Field()
  @Column("bool", { default: false })
  isAdmin: boolean;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  defaultDownloadPath: string;

  @Field({ nullable: true })
  smbEnabled: boolean;

  @Column("text")
  password: string;

  @Column("text", { nullable: true })
  profilePictureId: string;

  @Column("int", { array: true, default: [] })
  friendsIds: number[];

  @Field(() => [User])
  friends() {
    return User.find({ where: { id: In(this.friendsIds) } });
  }
}
