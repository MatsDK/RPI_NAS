import { Field, InputType, ObjectType } from "type-graphql";
import { Type } from "../../types";

@InputType()
export class DownloadSessionInput {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: Type;
}

@ObjectType()
export class DownloadSessionObject {
  @Field(() => String)
  path: string;

  @Field(() => String)
  type: Type;
}
