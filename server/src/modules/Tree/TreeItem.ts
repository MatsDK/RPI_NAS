import { Field, ObjectType } from "type-graphql";
import { getTreeObject } from "../../utils/getTreeObject";

@ObjectType()
export class TreeItem {
  @Field(() => String)
  name: string;

  @Field(() => String)
  path: string;

  @Field(() => Boolean)
  isDirectory: boolean;

  @Field(() => Number)
  size: number;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

  constructor(depth: number, path: string) {
    this.tree = getTreeObject(path, depth);
  }
}
