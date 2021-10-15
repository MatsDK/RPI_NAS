import fs from "fs";
import { ids } from "../../constants";
import cp from "child_process";
import util from "util";

const exec = util.promisify(cp.exec);

export const createDatastoreFolder = async (
  path: string,
  sizeInMb: number
): Promise<{ err: any }> => {
  try {
    fs.mkdirSync(path);

    if ((await createFileSize(sizeInMb)).err) return { err: true };
    if ((await createFs()).err) return { err: true };
    if ((await mountFs(path)).err) return { err: true };

    fs.rmSync("./fileSize");
    fs.chownSync(path, ids.uid, ids.gid);

    return { err: false };
  } catch (err) {
    return { err };
  }
};

const createFileSize = async (sizeInMb: number): Promise<{ err: any }> => {
  const { stderr } = await exec(
    `dd if=/dev/zero of=fileSize bs=1000 count=${sizeInMb}K`
  );

  return { err: false };
};

const createFs = async (): Promise<{ err: any }> => {
  const { stderr } = await exec(`mkfs.ext4 fileSize`);

  return { err: false };
};

const mountFs = async (path: string): Promise<{ err: any }> => {
  const { stderr } = await exec(`mount fileSize ${path}`);

  return { err: false };
};
