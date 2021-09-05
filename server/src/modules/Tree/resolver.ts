import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/auth";
import { MyContext } from "../../types";
import { buildTreeObject } from "./buildTreeObject";
import { GetTreeInput } from "./GetTreeInput";
import { Tree } from "./TreeObject";

@Resolver()
export class TreeResolver {
  @UseMiddleware(isAuth)
  @Query(() => Tree, { nullable: true })
  async tree(
    @Arg("data", () => GetTreeInput)
    { dataStoreId, path, depth }: GetTreeInput,
    @Ctx() { req }: MyContext
  ): Promise<Tree> {
    const userId = (req as any).userId;

    return await buildTreeObject({
      dataStoreId,
      path,
      depth,
      userId,
      directoryTree: false,
    });
  }

  @UseMiddleware(isAuth)
  @Query(() => Tree, { nullable: true })
  async directoryTree(
    @Arg("data", () => GetTreeInput)
    { dataStoreId, path, depth }: GetTreeInput,
    @Ctx() { req }: MyContext
  ): Promise<Tree> {
    const userId = (req as any).userId;

    const res = await buildTreeObject({
      dataStoreId,
      path,
      depth,
      userId,
      directoryTree: true,
    });

    return res;
  }
}
