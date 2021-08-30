import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UploadSessionReturn {
  @Field(() => String)
  uploadPath: string;

  @Field(() => String)
  hostIp: string;

  @Field(() => String)
  username: string;

  @Field(() => Number)
  port: number;

  @Field(() => String)
  password: string;
}
