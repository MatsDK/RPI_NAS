import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class UpdateDatastoreInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  ownerSMBEnabled?: boolean;

  @Field(() => [Number])
  sharedusers: number[];

  @Field(() => [AllowedSMBUser])
  allowdSMBUsers: AllowedSMBUser[];
}

@ObjectType()
class SharedUsers {
  @Field()
  userId: number;
}

@ObjectType()
class AllowedSMBUser {
  @Field()
  userId: number;

  @Field()
  allowed: boolean;
}
