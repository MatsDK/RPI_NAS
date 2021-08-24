import { Field, ObjectType } from "type-graphql";
import fsPath from "path";
import { getTreeObject } from "../../utils/getTreeObject";

@ObjectType()
export class TreeItem {
  @Field(() => String)
  name: string;

  @Field(() => String)
  path: string;

  @Field(() => String)
  relativePath: string;

  @Field(() => Boolean)
  isDirectory: boolean;

  @Field(() => Number)
  size: number;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

  constructor(
    depth: number,
    path: string,
    directoryTree: boolean,
    basePath: string = ""
  ) {
    this.tree = getTreeObject(fsPath.relative(basePath, path), depth, {
      directoryTree,
      basePath,
    });
  }
}
