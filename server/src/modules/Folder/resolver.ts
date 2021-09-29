import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import fs from "fs";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import fsPath from "path";
import { checkPermissions } from "../../middleware/checkPermissions";
import { DeletePathsInput } from "./deletePathsInput";

@Resolver()
export class FolderResolver {
  @UseMiddleware(isAuth, checkPermissions)
  @Mutation(() => Boolean, { nullable: true })
  async createFolder(
    @Arg("dataStoreId") dataStoreId: number,
    @Arg("path") path: string
  ): Promise<boolean | null> {
    const dataStore = await Datastore.findOne({ where: { id: dataStoreId } });
    if (!dataStore) return null;

    try {
      fs.mkdirSync(fsPath.join(dataStore.basePath, path));
    } catch (error) {
      console.log(error);
      return null;
    }

    return true;
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
}
