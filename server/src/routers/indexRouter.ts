import { Router } from "express";
import { downloadSessions } from "../utils/transferData/downloadSessions";

const router = Router();

router.route("/download").get((req, res) => {
  const { s: sessionId }: { s: string } = req.query as any;

  const thisSession = downloadSessions.getSession(sessionId);

  if (!thisSession) return res.json({ err: "session not found" });

  console.log(thisSession);

  res.json({ test: "" });

  downloadSessions.deleteSessions(sessionId);
});

export { router };
