import { Field, InputType } from "type-graphql";
import { Type } from "../../types";

@InputType()
export class DownloadSessionInput {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: Type;
}
