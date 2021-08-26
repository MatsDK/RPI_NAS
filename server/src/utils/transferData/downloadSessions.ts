import { DownloadSessionInput } from "../../modules/TransferData/DownloadSessionInput";

export const downloadSessions = {
  sessions: new Map(),
  addSession: (id: string, paths: DownloadSessionInput[]) => {
    downloadSessions.sessions.set(id, paths);
  },
  deleteSessions: (id: string) => {
    downloadSessions.sessions.delete(id);
  },
  getSession: (id: string) => {
    return downloadSessions.sessions.get(id);
  },
};
