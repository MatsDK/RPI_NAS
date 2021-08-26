import { Arg, Mutation, Resolver } from "type-graphql";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { v4 } from "uuid";
import { downloadSessions } from "../../utils/transferData/downloadSessions";

@Resolver()
export class TreeResolver {
  @Mutation(() => String)
  createDownloadSession(
    @Arg("data", () => [DownloadSessionInput]) data: DownloadSessionInput[]
  ): string {
    const id = v4();

    downloadSessions.addSession(id, data);

    return id;
  }
}
