import fsPath from "path";
import fs from "fs-extra";
import { Datastore, DataStoreStatus } from "../../entity/Datastore";
import { Node } from "../../entity/CloudNode";
import { User } from "../../entity/User";
import { exec } from "../exec";
import { dfOptions } from "../../constants";
const df = require("node-df");

interface updateMountPointsProps {
  datastore: Datastore;
  host: Node;
  user: User;
}

export const updateMountPoints = async (
  { datastore, user }: updateMountPointsProps,
  serviceName: string
): Promise<{ err: any }> => {
  datastore.status = DataStoreStatus.INIT;

  const returnErr = async (err: any): Promise<{ err: any }> => {
    datastore.status = DataStoreStatus.ONLINE;
    datastore.smbEnabled = !datastore.smbEnabled;
    await datastore.save();

    return { err };
  };

  switch (serviceName) {
    case "SMB": {
      try {
        datastore.smbEnabled = !datastore.smbEnabled;
        await datastore.save();

        const mountPoint = fsPath.join(
          `/home/`,
          user.osUserName,
          datastore.name
        );

        if (datastore.smbEnabled) {
          const fileSystemLoc = await getFileSystemLocation(datastore.basePath);
          if (!fileSystemLoc) return await returnErr("File system not found");

          fs.mkdirSync(mountPoint);

          const { stderr: mountErr } = await exec(
            `mount ${fileSystemLoc} ${mountPoint}`
          );
          if (mountErr) return await returnErr(mountErr);
        } else {
          const { stderr: umountErr } = await exec(`umount ${mountPoint}`);
          if (umountErr) return returnErr(umountErr);

          fs.removeSync(mountPoint);
        }

        datastore.status = DataStoreStatus.ONLINE;
        await datastore.save();
      } catch (e) {
        return await returnErr(e);
      }

      break;
    }
    case "FTP": {
      break;
    }
  }

  return { err: false };
};

const getFileSystemLocation = async (
  path: string
): Promise<string | undefined> =>
  new Promise((resolve, rej) => {
    df({ ...dfOptions, file: "-a" }, (err: any, res: any) => {
      if (err) rej(err);

      resolve(res.filter((fs: any) => fs.mount === path)[0]?.filesystem);
    });
  });
