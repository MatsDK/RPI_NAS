import { Arg, Mutation, Resolver } from "type-graphql";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { v4 } from "uuid";
import { downloadSessions } from "../../utils/transferData/downloadSessions";
import fsPath from "path";

@Resolver()
export class TreeResolver {
  @Mutation(() => String)
  createDownloadSession(
    @Arg("data", () => [DownloadSessionInput]) data: DownloadSessionInput[]
  ): string {
    const id = v4();

    downloadSessions.addSession(
      id,
      data.map((obj) => ({ ...obj, path: fsPath.join("H:/js-py", obj.path) }))
    );

    return id;
  }
}
