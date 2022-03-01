import { exec } from "../exec";
import fsPath from "path";
import { Any } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { User } from "../../entity/User";
import { SharedDatastoresIdsInput } from "../../modules/Datastore/CreateSharedDatastoreInput";

export const createGroup = async (
  groupName: string,
  userName: string
): Promise<{ err: any }> => {
  const { stderr: createGroupErr } = await exec(`groupadd ${groupName}`);
  if (createGroupErr) return { err: createGroupErr };

  const { stderr: addOwnerToGroupErr } = await exec(
    `usermod -aG ${groupName} ${userName}`
  );
  if (addOwnerToGroupErr) return { err: addOwnerToGroupErr };

  return { err: false };
};

interface Props {
  cmd: (groupName: string, osUserName: string) => Promise<any>;
  ids: SharedDatastoresIdsInput[];
}

const addAndRemoveUsersFromGroup = async ({
  cmd,
  ids,
}: Props): Promise<{ err: any }> => {
  const datastores = await Datastore.find({
    where: { id: Any(ids.map((i) => i.datastoreId)) },
  }),
    users = await User.find({ where: { id: Any(ids.map((i) => i.userId)) } });

  for (const sharedDatastore of ids) {
    try {
      const datastore = datastores.find(
        (d) => d.id === sharedDatastore.datastoreId
      ),
        user = users.find((d) => d.id === sharedDatastore.userId);

      if (!datastore || !user) continue;

      const { stderr } = await cmd(
        fsPath.basename(datastore.basePath),
        user.osUserName
      );
      if (stderr) return { err: stderr };
    } catch (err) {
      return { err };
    }
  }

  return { err: false };
};

export const addUsersToGroup = async (
  ids: SharedDatastoresIdsInput[]
): Promise<{ err: any }> => ({
  err:
    (
      await addAndRemoveUsersFromGroup({
        cmd: (groupName, userName) =>
          exec(`usermod -aG ${groupName} ${userName}`),
        ids,
      })
    ).err || false,
});

export const removeUsersFromGroup = async (
  ids: SharedDatastoresIdsInput[]
): Promise<{ err: any }> => ({
  err:
    (
      await addAndRemoveUsersFromGroup({
        cmd: (groupName, userName) =>
          exec(`gpasswd -d ${userName} ${groupName}`),
        ids,
      })
    ).err || false,
});

export const groups = { add: addUsersToGroup, remove: removeUsersFromGroup };
