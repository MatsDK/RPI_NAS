import { Field, InputType, ObjectType } from "type-graphql";
import { Type } from "../../types/Context";

@InputType()
export class DownloadSessionInput {
  @Field(() => String)
  type: string;

  @Field(() => [DownloadPathsInput])
  downloadPaths: DownloadPathsInput[];

  @Field(() => Number)
  datastoreId: number;
}

@InputType()
export class DownloadPathsInput {
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
