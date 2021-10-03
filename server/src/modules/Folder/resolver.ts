import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Datastore } from "../../entity/Datastore";
import fs from "fs-extra";
import { isAuth } from "../../middleware/auth";
import fsPath from "path";
import { checkPermissions } from "../../middleware/checkPermissions";
import { DeletePathsInput } from "./deletePathsInput";
import { CopyInput } from "./copyMutationInput";

@Resolver()
export class FolderResolver {
  @UseMiddleware(isAuth, checkPermissions)
  @Mutation(() => String, { nullable: true })
  async createFolder(
    @Arg("dataStoreId") dataStoreId: number,
    @Arg("path") path: string
  ): Promise<string | null> {
    const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
    if (!dataStore) return null;

    try {
      fs.mkdirSync(fsPath.join(dataStore.basePath, path));
    } catch (error) {
      console.log(error);
      return null;
    }

    return fsPath.join(dataStore.basePath, path);
  }

  @UseMiddleware(isAuth, checkPermissions)
  @Mutation(() => Boolean, { nullable: true })
  async delete(
    @Arg("dataStoreId") dataStoreId: number,
    @Arg("paths", () => [DeletePathsInput]) paths: DeletePathsInput[]
  ): Promise<boolean | null> {
    const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
    if (!dataStore) return null;

    try {
      for (const { path, type } of paths) {
        const fullPath = fsPath.join(dataStore.basePath, path);

        if (type == "file") fs.rmSync(fullPath);
        else fs.rmdirSync(fullPath, { recursive: true });
      }
    } catch (error) {
      console.log(error);
      return null;
    }

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async copy(@Arg("data") { data, dataStoreId, destination }: CopyInput) {
    const dataStores: Map<number, Datastore> = new Map();

    const thisDataStore = await Datastore.find({
      where: [{ id: dataStoreId }, { id: destination.dataStoreId }],
    });

    if (thisDataStore.length !== 2) return null;
    thisDataStore.forEach((v) => dataStores.set(v.id, v));

    const ds = dataStores.get(dataStoreId),
      destDs = dataStores.get(destination.dataStoreId);

    if (!ds || !destDs) return null;

    for (const { path } of data) {
      const fromPath = fsPath.join(ds.basePath, path),
        toPath = fsPath.join(
          destDs.basePath,
          destination.path,
          fsPath.basename(path)
        );

      fs.copySync(fromPath, toPath, { recursive: true });
    }

    return true;
  }
}
