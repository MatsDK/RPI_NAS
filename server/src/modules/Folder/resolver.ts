import { Arg, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Datastore } from "../../entity/Datastore";
import fs from "fs-extra";
import { isAuth } from "../../middleware/auth";
import fsPath from "path";
import { checkPermissions } from "../../middleware/checkPermissions";
import { DeletePathsInput } from "./deletePathsInput";
import { CopyMoveInput } from "./copyMoveMutationInput";
import { MoveCopyData } from "./moveCopyData";
import { exec } from "../../utils/exec";
import { Node } from "../../entity/CloudNode";

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

    const host = await Node.findOne({ where: { id: dataStore.localNodeId } });
    if (!host) return null;

    try {
      const full_path = fsPath.join(dataStore.basePath, path);
      fs.mkdirSync(full_path);
      const cmd = `chown ${host.loginName}:${fsPath.basename(
        dataStore.basePath
      )} "${full_path}"`;
      await exec(
        cmd
      );
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
  copy(@Arg("data") data: CopyMoveInput) {
    return MoveCopyData({ ...data, type: "copy" });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  move(@Arg("data") data: CopyMoveInput) {
    return MoveCopyData({ ...data, type: "move" });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async updateOwnership(@Arg("datastoreId") datastoreId: number) {
    const datastore = await Datastore.findOne({ where: { id: datastoreId } })
    if (!datastore) return null

    const node = await Node.findOne({ where: { id: datastore.localHostNodeId } })
    if (!node) return null

    if (node.hostNode) {
      const { stderr } =
        await exec(`chown ${node.loginName}:${fsPath.basename(datastore.basePath)} ${datastore.basePath}/* -R`)
      if (stderr) {
        console.log(stderr)
        return null
      }

      return true
    }
    return false
  }
}
