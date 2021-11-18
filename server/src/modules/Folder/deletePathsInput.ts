import { Field, InputType } from "type-graphql";
import { Type } from "../../types/Context";

@InputType()
export class DeletePathsInput {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: Type;
}
