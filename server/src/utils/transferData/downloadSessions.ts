import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { DownloadPathsInput } from "../../modules/TransferData/DownloadSessionInput";

export interface DownloadSession {
	paths: DownloadPathsInput[]
	datastore: Datastore
	node: Node
}

interface DownloadSessions {
	sessions: Map<string, DownloadSession>
	addSession: (id: string, session: DownloadSession) => void
	deleteSessions: (id: string) => void
	getSession: (id: string) => DownloadSession | undefined
}

export const downloadSessions: DownloadSessions = {
	sessions: new Map(),
	addSession: (id: string, session: DownloadSession) => {
		downloadSessions.sessions.set(id, session);
	},
	deleteSessions: (id: string) => {
		downloadSessions.sessions.delete(id);
	},
	getSession: (id: string) => {
		return downloadSessions.sessions.get(id);
	},
};
