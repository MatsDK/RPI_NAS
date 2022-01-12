import { Field, ObjectType } from "type-graphql";
import { getTreeObject } from "../../utils/getTreeObject";
import { TreeItem } from "./TreeItem";
import { getDataStoresTreeObject } from "../../utils/dataStore/getDataStoresTreeObject";

@ObjectType()
export class Tree {
  @Field(() => String)
  path: string;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

  @Field(() => Boolean)
  userInitialized: boolean

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

    if (basePath != null)
      this.tree = getTreeObject(path, depth, {
        checkPath: true,
        directoryTree,
        basePath,
      });
    else if (userOptions)
      this.tree = await getDataStoresTreeObject(
        userOptions,
        depth,
        path,
        directoryTree
      );

    return this;
  }
}
