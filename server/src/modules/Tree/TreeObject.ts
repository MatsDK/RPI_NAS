import { Field, ObjectType } from "type-graphql";
import fsPath from "path";
import { Datastore } from "../../entity/Datastore";
import { getTreeObject } from "../../utils/getTreeObject";
import { TreeItem } from "./TreeItem";

@ObjectType()
export class Tree {
  @Field(() => String)
  path: string;

  @Field(() => [TreeItem], { nullable: true })
  tree: TreeItem[] | null;

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
    else if (userOptions) {
      const { userId } = userOptions;

      const userDataStores = await Datastore.find({ where: { userId } }),
        items: TreeItem[] = [];

      for (const { basePath, name, id } of userDataStores) {
        const newItem = new TreeItem(
          depth,
          fsPath.join(basePath, path),
          directoryTree,
          basePath
        );

        newItem.name = name;
        newItem.path = basePath;
        newItem.relativePath = "";
        newItem.isDirectory = true;
        newItem.dataStoreId = id;

        items.push(newItem);
      }

      this.tree = items;
    }

    return this;
  }
}
