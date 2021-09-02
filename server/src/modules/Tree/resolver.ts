import { Arg, Query, Resolver } from "type-graphql";
import { Datastore } from "../../entity/Datastore";
import { Tree } from "./TreeObject";

@Resolver()
export class TreeResolver {
  @Query(() => Tree)
  async tree(
    @Arg("path", () => String) path: string,
    @Arg("dataStore", () => Number, { nullable: true }) dataStoreId: number,
    @Arg("depth", () => Number) depth: number = 1
  ): Promise<Tree> {
    const userId = 1;

    if (dataStoreId == null)
      return await new Tree().init(path, depth, null, true, { userId });

    const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
    if (!dataStore) throw new Error("datastore not found");

    return await new Tree().init(path, depth, dataStore.basePath, false);
  }

  @Query(() => Tree)
  async directoryTree(
    @Arg("path", () => String) path: string,
    @Arg("dataStore", () => Number, { nullable: true }) dataStoreId: number,
    @Arg("depth", () => Number) depth: number = 1
  ): Promise<Tree> {
    const userId = 1;

    if (dataStoreId == null)
      return await new Tree().init(path, depth, null, true, { userId });

    const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
    if (!dataStore) throw new Error("datastore not found");

    return await new Tree().init(path, depth, dataStore.basePath, true);
  }
}
