import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "ssh-package";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { data, connectData, downloadPath } = JSON.parse(
    req.query.data as string
  );
  console.log(data);

  const client = new Client(connectData);

  client.on("ready", () => {
    console.log("ready");
  });

  client.on("timeout", () => {
    console.log("timeout");
  });

  res.status(200).send("");
};
