import { Datastore } from "../../entity/Datastore";
import { User } from "../../entity/User"
import { Any } from "typeorm";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { exec } from "../exec";
import fsPath from "path";
import fs from "fs-extra";

const baseConf = [
  "read only = no",
  "browsable = yes",
  "writable = yes",
  "public = no",
  "guest ok  = yes",
  "create mask = 0770",
  "directory mask = 0770",
];

export const updateSMB = async (hostUserName: string): Promise<{err: any}> => {
  return new Promise(async (res, rej) => {
    try {
      const DatastoreServices = await DatastoreService.find({ where: { serviceName: ServiceNames.SMB } }),
        SMBDatastores = await Datastore.find({
          where: { id: Any(DatastoreServices.map((ds) => ds.datastoreId)) },
        }),
	users = await User.find({ where: { id: Any(DatastoreServices.map((ds) => ds.userId)) } }),
        baseConfPath = fsPath.join(__dirname, "../../../assets/base_smb.conf");

      let file = fs.readFileSync(baseConfPath).toString().split("\n");

      for (const datastore of SMBDatastores) {
        const userIds = DatastoreServices.filter(({ datastoreId }) => datastoreId === datastore.id).map(({ userId } ) => userId),
		validUsers  = users.filter(({ id }) => userIds.includes(id)).map(({ osUserName }) => osUserName)

        const newLines: string[] = [`[${datastore.name}]`, ...baseConf];

        newLines.push(`valid users = ${validUsers.join(", ")}`);
        newLines.push(`force user = ${hostUserName}`);
        newLines.push(`path = ${datastore.basePath}`);
        newLines.push(`force group = ${fsPath.basename(datastore.basePath)}`);

        file = [...file, ...newLines];
      }

      fs.writeFileSync(`/etc/samba/smb.conf`, file.join("\n"));

      const { err: SMBServiceErr } = await restartSMBService();
      if (SMBServiceErr) return rej({ err: SMBServiceErr });

      const { err: UpdateFirewallErr } = await updateFirewall();
      if (UpdateFirewallErr) return rej({ err: UpdateFirewallErr });

      res({ err: false });
    } catch (err) {
	    console.log(err)
      res({ err: false });
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
