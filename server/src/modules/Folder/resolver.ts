import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
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
import { MyContext } from "../../types/Context";
import { ApolloError } from "apollo-server-core";
import { getOrCreateNodeClient } from "../../utils/nodes/nodeClients";
import { UpdateOwnershipMutation } from "./UpdateOwnershipMutation";

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
  copy(@Ctx() { req }: MyContext, @Arg("data") data: CopyMoveInput) {
    return MoveCopyData({ ...data, type: "copy" }, req.userId);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  move(@Ctx() { req }: MyContext, @Arg("data") data: CopyMoveInput) {
    return MoveCopyData({ ...data, type: "move" }, req.userId);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async updateOwnership(@Arg("datastoreId") datastoreId: number) {
    const datastore = await Datastore.findOne({ where: { id: datastoreId } })
    if (!datastore) return null

    const node = await Node.findOne({ where: { id: datastore.localNodeId } })
    if (!node) return null

    if (node.hostNode) {
      const { stderr } =
        await exec(`chown ${node.loginName}:${fsPath.basename(datastore.basePath)} ${datastore.basePath}/* -R`)

      if (stderr) {
        console.log(stderr)
        throw new ApolloError(stderr)
      }
    } else {
      const client = await getOrCreateNodeClient({ node, ping: false })

      try {
        const res = await client?.conn.mutate({
          mutation: UpdateOwnershipMutation,
          variables: {
            loginName: node.loginName,
            datastoreName: fsPath.basename(datastore.basePath),
            path: datastore.basePath
          }
        })

        console.log(res)
      } catch (e) {
        console.log(e)
        throw new ApolloError(e)
      }
    }

    return true
  }
}
