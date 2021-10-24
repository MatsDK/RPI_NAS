import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { getUser } from "../../middleware/getUser";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { checkPermissions } from "../../middleware/checkPermissions";
import { MyContext } from "../../types/Context";
import { getUserDataStores } from "../../utils/dataStore/getUserDataStores";
import { buildTreeObject } from "./buildTreeObject";
import { GetTreeInput } from "./GetTreeInput";
import { Tree } from "./TreeObject";
import { getDatastoresWithSizesAndSharedUsers } from "../../utils/dataStore/getDatastoresWithSizesAndSharedUsers";

@Resolver()
export class TreeResolver {
  @UseMiddleware(isAuth, checkPermissions)
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

  @UseMiddleware(isAuth, checkPermissions)
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

  @UseMiddleware(isAuth, getUser)
  @Query(() => [Datastore], { nullable: true })
  async getDataStores(@Ctx() { req }: MyContext): Promise<Datastore[]> {
    const dataStores = await ((req as any).user?.isAdmin
      ? Datastore.find()
      : getUserDataStores(req.userId));

    return await getDatastoresWithSizesAndSharedUsers(dataStores, req.userId!);
  }
}
