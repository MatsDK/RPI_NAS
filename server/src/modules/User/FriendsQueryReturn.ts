import { Field, ObjectType } from "type-graphql";
import { User } from "../../entity/User";

@ObjectType()
export class FriendsQueryReturn {
  @Field(() => [User])
  friends: User[];

  @Field(() => [User])
  friendsRequest: User[];
}
