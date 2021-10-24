import { User } from "../../entity/User";
import { exec } from "../exec";
import fsPath from "path";
import fs from "fs-extra";

const baseConf = [
  "read only = no",
  "browsable = yes",
  "writable = yes",
  "public = yes",
  "guest ok  = yes",
  "create mask = 0770",
  "directory mask = 0770",
];

export const updateSMB = async (hostUserName: string) => {
  return new Promise(async (res, rej) => {
    try {
      const SMBUsers = await User.find({ where: { smbEnabled: true } }),
        baseConfPath = fsPath.join(__dirname, "../../../assets/base_smb.conf");

      let file = fs.readFileSync(baseConfPath).toString().split("\n");

      for (const user of SMBUsers) {
        const newLines: string[] = [`[${user.osUserName}]`, ...baseConf];

        newLines.push(`force user = ${hostUserName}`);
        newLines.push(`path = /home/${user.osUserName}`);
        newLines.push(`force group = ${user.osUserName}`);

        file = [...file, ...newLines];
      }

      fs.writeFileSync(`/etc/samba/smb.conf`, file.join("\n"));

      const { err: SMBServiceErr } = await restartSMBService();
      if (SMBServiceErr) return rej({ err: SMBServiceErr });

      const { err: UpdateFirewallErr } = await updateFirewall();
      if (UpdateFirewallErr) return rej({ err: UpdateFirewallErr });

      res({ err: false });
    } catch (err) {
      rej({ err });
    }
  });
};

type returnType = { err: string | boolean };

const restartSMBService = async (): Promise<returnType> => {
  const { stderr } = await exec(`service smbd restart`);

  return { err: !!stderr ? stderr : false };
};

const updateFirewall = async (): Promise<returnType> => {
  const { stderr } = await exec(`ufw allow samba`);

  return { err: !!stderr ? stderr : false };
};
