import { Router } from "express";
import {IMGS_FOLDER} from "../constants"
import fsPath from "path";
import fs from "fs-extra";
import { downloadSessions } from "../utils/transferData/downloadSessions";
import { getDownloadPath } from "../utils/transferData/getDownloadPath";

const router = Router();

router.route("/download").get(async (req, res) => {
  const { s: sessionId }: { s: string } = req.query as any;

  const thisSession = downloadSessions.getSession(sessionId);
  downloadSessions.deleteSessions(sessionId);

  if (!thisSession) return res.json({ err: "session not found" });

  const downloadPath = await getDownloadPath(thisSession, sessionId);

  if (typeof downloadPath !== "string")
    return res.json({ err: downloadPath.err });

  if (downloadPath) {
    res.download(downloadPath, (err) => {
      if (err) throw err;

      fs.unlinkSync(downloadPath);
    });

    return;
  }

  res.json({ err: "unknown error" });
});

router.get("/profile/:id", (req, res) => {
	const userId = req.params?.id

	if(userId == null ) {
		return res.json()
	}

	const path = fsPath.join(IMGS_FOLDER,  `${userId}.png`)

	if(fs.pathExistsSync(path))
		res.sendFile(path)
	else {
		console.log("default pic")
		return res.json()
	}
})

export { router };
