import { Field, InputType, ObjectType } from "type-graphql";
import { Type } from "../../types";

@InputType()
export class DeletePathsInput {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: Type;
}
