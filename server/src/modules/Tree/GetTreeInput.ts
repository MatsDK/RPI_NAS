import { Field, InputType } from "type-graphql";
import { Type } from "../../types";

@InputType()
export class GetTreeInput {
  @Field(() => String)
  path: string;

  @Field(() => Number, { nullable: true })
  dataStore: number;

  @Field(() => Number, { nullable: true })
  depth: number;
}
