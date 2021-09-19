import { Field, InputType } from "type-graphql";

@InputType()
export class CreateSharedDataStoreInput {
  @Field(() => [SharedDataStoresIdsInput])
  ids: SharedDataStoresIdsInput[];
}

@InputType()
export class SharedDataStoresIdsInput {
  @Field(() => Number)
  userId: number;

  @Field(() => Number)
  dataStoreId: number;
}
