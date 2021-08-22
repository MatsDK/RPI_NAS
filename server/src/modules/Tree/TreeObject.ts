import { Field, ObjectType } from "type-graphql";
import { getTreeObject } from "../../utils/getTreeObject";
import { TreeItem } from "./TreeItem";

@ObjectType()
export class Tree {
  @Field(() => String)
  path: string;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

  constructor(path: string, depth: number) {
    this.path = path;

    this.tree = getTreeObject(path, depth, true);
  }
}
