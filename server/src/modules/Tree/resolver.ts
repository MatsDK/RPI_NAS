import { Arg, Query, Resolver } from "type-graphql";
import { buildTreeObject } from "./buildTreeObject";
import { GetTreeInput } from "./getTreeInput";
import { Tree } from "./TreeObject";

@Resolver()
export class TreeResolver {
  @Query(() => Tree)
  async tree(
    @Arg("data", () => GetTreeInput)
    { dataStore: dataStoreId, path, depth }: GetTreeInput
  ): Promise<Tree> {
    const userId = 1;

    return await buildTreeObject({
      dataStoreId,
      path,
      depth,
      userId,
      directoryTree: false,
    });
  }

  @Query(() => Tree)
  async directoryTree(
    @Arg("data", () => GetTreeInput)
    { dataStore: dataStoreId, path, depth }: GetTreeInput
  ): Promise<Tree> {
    const userId = 1;

    return await buildTreeObject({
      dataStoreId,
      path,
      depth,
      userId,
      directoryTree: true,
    });
  }
}
