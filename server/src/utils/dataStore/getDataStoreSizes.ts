const df = require("node-df");
import { Datastore, SizeObject } from "../../entity/Datastore";

const options = { prefixMultiplier: "MiB", isDisplayPrefixMultiplier: false };

export const getDataStoreSizes = (
  dataStores: Datastore[]
): Promise<Datastore[]> =>
  new Promise((res, rej) => {
    df(options, (err: any, r: any) => {
      if (err) rej(err);

      for (const ds of dataStores) {
        const fs = r.find((f: any) => f.mount === ds.basePath);

        if (fs) {
          const sizeObj = new SizeObject();

          sizeObj.usedSize = Math.round(fs.used * 10) / 10;
          sizeObj.usedPercent = Math.round(fs.capacity * 100);

          ds.size = sizeObj;
        }
      }

      res(dataStores);
    });
  });
