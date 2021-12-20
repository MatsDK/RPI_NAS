import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { v4 } from "uuid";
import { downloadSessions } from "../../utils/transferData/downloadSessions";
import fsPath from "path";
import { DownloadSessionReturn } from "./DownloadSessionReturn";
import { UploadSessionReturn } from "./UploadSessionReturn";
import { isAuth } from "../../middleware/auth";
import { getDataStoreAndNode } from "../../middleware/getDataStoreNode";
import { Datastore } from "../../entity/Datastore";
import { UploadSessionInput } from "./UploadSessionInput";
import { Node } from "../../entity/CloudNode";

@Resolver()
export class TreeResolver {
  @UseMiddleware(isAuth, getDataStoreAndNode)
  @Mutation(() => UploadSessionReturn, { nullable: true })
  createUploadSession(
    @Arg("data", () => UploadSessionInput)
    { uploadPath }: UploadSessionInput,
    @Ctx() { req }: any
  ): UploadSessionReturn {
    const dataStore = req.dataStore as Datastore,
      localNode = req.localNode as Node,
      returnObj = new UploadSessionReturn();

    returnObj.uploadPath = fsPath.join(dataStore.basePath, uploadPath);

    returnObj.hostIp = localNode.ip;
    returnObj.password = localNode.password;
    returnObj.username = localNode.loginName;
    returnObj.port = localNode.sshPort!;

    return returnObj;
  }

  @UseMiddleware(isAuth, getDataStoreAndNode)
  @Mutation(() => DownloadSessionReturn, { nullable: true })
  createDownloadSession(
    @Arg("data", () => DownloadSessionInput)
    { downloadPaths, type }: DownloadSessionInput,
    @Ctx() { req }: any
  ): DownloadSessionReturn {
    const returnObj = new DownloadSessionReturn(),
      dataStore = req.dataStore as Datastore;

    switch (type) {
      case "http":
        const id = v4();

        downloadSessions.addSession(
          id,
          downloadPaths.map((obj) => ({
            ...obj,
            path: fsPath.join(dataStore.basePath, obj.path),
          }))
        );

        returnObj.id = id;
        break;

      case "SSH":
        const localNode = req.localNode as Node;

        returnObj.data = downloadPaths.map(({ path, ...rest }) => ({
          ...rest,
          path: fsPath.join(dataStore.basePath, path),
        }));

        returnObj.hostIp = localNode.ip;
        returnObj.password = localNode.password;
        returnObj.username = localNode.loginName;
        returnObj.port = localNode.sshPort!;
        break;

      default:
        break;
    }

    return returnObj;
  }
}
