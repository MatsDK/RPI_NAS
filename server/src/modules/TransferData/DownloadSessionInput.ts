import { Field, InputType } from "type-graphql";

@InputType()
export class DownloadSessionInput {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: string;
}
