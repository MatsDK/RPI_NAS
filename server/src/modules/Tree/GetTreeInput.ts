import { Field, InputType } from "type-graphql";

@InputType()
export class GetTreeInput {
  @Field(() => String)
  path: string;

  @Field(() => Number, { nullable: true })
  dataStoreId: number;

  @Field(() => Number, { nullable: true })
  depth: number;
}
