import type { NextApiRequest, NextApiResponse } from "next";
import { list } from "drivelist";

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const drives = await list();
  res.json({ drives });
};
