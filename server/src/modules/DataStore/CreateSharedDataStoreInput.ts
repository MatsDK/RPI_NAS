import { Field, InputType } from "type-graphql";

@InputType()
export class CreateSharedDatastoreInput {
  @Field(() => [SharedDatastoresIdsInput])
  ids: SharedDatastoresIdsInput[];
}

@InputType()
export class SharedDatastoresIdsInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  datastoreId: number;
}
