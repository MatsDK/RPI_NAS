import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDataStoreInput {
  @Field()
  localNodeId: number;

  @Field()
  name: string;
}
