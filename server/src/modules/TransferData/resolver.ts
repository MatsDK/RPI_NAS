import { Arg, Mutation, Resolver } from "type-graphql";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { v4 } from "uuid";
import { downloadSessions } from "../../utils/transferData/downloadSessions";
import fsPath from "path";
import { DownloadSessionReturn } from "./DownloadSessionReturn";

@Resolver()
export class TreeResolver {
  @Mutation(() => DownloadSessionReturn)
  createDownloadSession(
    @Arg("data", () => [DownloadSessionInput]) data: DownloadSessionInput[],
    @Arg("type", () => String) type: string
  ): DownloadSessionReturn {
    const returnObj = new DownloadSessionReturn();

    if (type === "http") {
      const id = v4();

      downloadSessions.addSession(
        id,
        data.map((obj) => ({
          ...obj,
          path: fsPath.join(process.env.BASEPATH || "", obj.path),
        }))
      );

      returnObj.id = id;
    } else if (type === "SSH") {
      returnObj.data = data.map(({ path, type }) => ({
        type,
        path: fsPath.join(process.env.BASEPATH || "", path),
      }));

      returnObj.hostIp = process.env.HOST_IP;
      returnObj.password = "mats";
      returnObj.username = "mats";
      returnObj.port = 22;
    }

    return returnObj;
  }
}
