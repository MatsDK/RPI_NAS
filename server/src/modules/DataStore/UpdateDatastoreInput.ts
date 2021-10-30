import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateDatastoreInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  ownerSMBEnabled?: boolean;

  @Field(() => [Number], { nullable: true })
  sharedusers?: number[];

  @Field(() => [AllowedSMBUser], { nullable: true })
  allowedSMBUsers?: AllowedSMBUser[];
}

@InputType()
class AllowedSMBUser {
  @Field()
  userId: number;

  @Field()
  allowed: boolean;
}
