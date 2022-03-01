import { Field, ObjectType } from "type-graphql";
import { getTreeObject } from "../../utils/getTreeObject";
import { TreeItem } from "./TreeItem";
import { getDatastoresTreeObject } from "../../utils/datastore/getDatastoresTreeObject";

@ObjectType()
export class Tree {
  @Field(() => String)
  path: string;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

  @Field(() => Boolean)
  userInitialized: boolean

  @Field(() => Boolean)
  timeout: boolean

  constructor(userInitialized: boolean) {
    this.userInitialized = userInitialized
  }

  async init(
    path: string,
    depth: number,
    basePath: string | null,
    directoryTree: boolean,
    userOptions?: { userId: number }
  ): Promise<Tree> {
    this.path = path;
    this.timeout = false

    if (basePath != null)
      this.tree = getTreeObject(path, depth, {
        checkPath: true,
        directoryTree,
        basePath,
      });
    else if (userOptions)
      this.tree = await getDatastoresTreeObject(
        userOptions,
        depth,
        path,
        directoryTree,
      );

    return this;
  }
}
