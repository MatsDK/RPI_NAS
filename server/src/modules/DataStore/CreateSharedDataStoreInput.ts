import { Field, InputType } from "type-graphql";

@InputType()
export class CreateSharedDataStoreInput {
  @Field(() => [Number])
  userIds: number[];

  @Field(() => [Number])
  dataStoreIds: number[];
}
