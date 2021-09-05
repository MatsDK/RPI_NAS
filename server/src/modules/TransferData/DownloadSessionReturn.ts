import { Field, ObjectType } from "type-graphql";
import { DownloadSessionObject } from "./DownloadSessionInput";

@ObjectType()
export class DownloadSessionReturn {
  @Field(() => String, { nullable: true })
  id?: string | null;

  @Field(() => [DownloadSessionObject], { nullable: true })
  data?: DownloadSessionObject[] | null;

  @Field(() => String, { nullable: true })
  hostIp?: string | null;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => Number, { nullable: true })
  port?: number | null;

  @Field(() => String, { nullable: true })
  password?: string | null;
}
