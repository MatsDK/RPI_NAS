import { Field, InputType } from "type-graphql";

@InputType()
export class UploadSessionInput {
  @Field(() => String)
  uploadPath: string;

  @Field(() => Number)
  datastoreId: number;
}
