import { DownloadPathsInput } from "../../modules/TransferData/DownloadSessionInput";

export const downloadSessions = {
  sessions: new Map(),
  addSession: (id: string, paths: DownloadPathsInput[]) => {
    downloadSessions.sessions.set(id, paths);
  },
  deleteSessions: (id: string) => {
    downloadSessions.sessions.delete(id);
  },
  getSession: (id: string) => {
    return downloadSessions.sessions.get(id);
  },
};
