import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { getUser } from "../../middleware/getUser"
import { Any } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { SharedDataStore } from "../../entity/SharedDataStore";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { checkPermissions } from "../../middleware/checkPermissions";
import { MyContext } from "../../types/Context";
import { getUserDataStores } from "../../utils/dataStore/getUserDataStores";
import { buildTreeObject } from "./buildTreeObject";
import { GetTreeInput } from "./GetTreeInput";
import { Tree } from "./TreeObject";
import { getDataStoreSizes } from "../../utils/dataStore/getDataStoreSizes"

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
    const dataStores = await getUserDataStores(req.userId);

    const sharedDataStores = await SharedDataStore.find({
      where: {
        dataStoreId: Any(dataStores.map((v) => v.id)),
      },
    });

    const users = await User.find({
      where: {
        id: Any(
          Array.from(
            new Set([
              (req as any).userId,
              ...sharedDataStores.map(({ userId }) => userId),
              ...dataStores.map(({ userId }) => userId),
            ])
          )
        ),
      },
    });

    const sharedUsersMap: Map<number, User[]> = new Map();

    sharedDataStores.forEach((sharedDatastore) => {
      const thisUser = users.find(({ id }) => id === sharedDatastore.userId);

      if (thisUser)
        sharedUsersMap.set(sharedDatastore.dataStoreId, [
          ...(sharedUsersMap.get(sharedDatastore.dataStoreId) || []),
          thisUser,
        ]);
    });

    return await getDataStoreSizes(dataStores.map((dataStore) => ({
      ...dataStore,
      sharedUsers: sharedUsersMap.get(dataStore.id) || [],
      owner: users.find(({ id }) => id === dataStore.userId),
    })) as any);
  }
}
