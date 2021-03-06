import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../../middleware/auth";
import { checkPermissions } from "../../middleware/checkPermissions";
import { MyContext } from "../../types/Context";
import { buildTreeObject } from "./buildTreeObject";
import { GetTreeInput } from "./GetTreeInput";
import { Tree } from "./TreeObject";

@Resolver()
export class TreeResolver {
  @UseMiddleware(isAuth, checkPermissions)
  @Query(() => Tree, { nullable: true })
  async tree(
    @Arg("data", () => GetTreeInput)
    { datastoreId, path, depth }: GetTreeInput,
    @Ctx() { req }: MyContext
  ): Promise<Tree> {
    const userId = (req as any).userId;

    return await buildTreeObject({
      datastoreId,
      path,
      depth,
      userId,
      directoryTree: false,
    });
  }

  @UseMiddleware(isAuth, checkPermissions)
  @Query(() => Tree, { nullable: true })
  async directoryTree(
    @Arg("data", () => GetTreeInput)
    { datastoreId, path, depth }: GetTreeInput,
    @Ctx() { req }: MyContext
  ): Promise<Tree> {
    const userId = (req as any).userId;

    const res = await buildTreeObject({
      datastoreId,
      path,
      depth,
      userId,
      directoryTree: true,
    });

    return res;
  }
}
