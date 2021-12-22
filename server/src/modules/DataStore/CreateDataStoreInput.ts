import { Field, InputType } from "type-graphql";

@InputType()
export class CreateDataStoreInput {
  @Field()
  localNodeId: number;

  @Field()
  name: string;

  @Field()
  sizeInMB: number;

  @Field()
  ownerId: number;

  @Field({nullable: true})
  ownerPassword: string;
}
