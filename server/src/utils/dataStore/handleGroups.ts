import { exec } from "../exec";
import fsPath from "path";
import { Any } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { User } from "../../entity/User";
import { SharedDataStoresIdsInput } from "../../modules/DataStore/CreateSharedDataStoreInput";

export const createGroup = async (
  groupName: string,
  userName: string
): Promise<{ err: any }> => {
  const { stderr: createGroupErr } = await exec(`groupadd ${groupName}`);
  if (createGroupErr) return { err: createGroupErr };

  const { stderr: addOwnerToGroupErr } = await exec(
    `usermod -a -G ${groupName} ${userName}`
  );
  if (addOwnerToGroupErr) return { err: addOwnerToGroupErr };

  return { err: false };
};

export const addUsersToGroup = async (
  ids: SharedDataStoresIdsInput[]
): Promise<{ err: any }> => {
  const datastores = await Datastore.find({
      where: { id: Any(ids.map((i) => i.dataStoreId)) },
    }),
    users = await User.find({ where: { id: Any(ids.map((i) => i.userId)) } });

  for (const sharedDatastore of ids) {
    const datastore = datastores.find(
        (d) => d.id === sharedDatastore.dataStoreId
      ),
      user = users.find((d) => d.id === sharedDatastore.userId);

    if (!datastore || !user) continue;

    const { stderr: addUserToGroupErr } = await exec(
      `usermod -aG ${fsPath.basename(datastore.basePath)} ${user.osUserName}`
    );
    if (addUserToGroupErr) return { err: addUserToGroupErr };
  }

  return { err: false };
};

export const removeUsersFromGroup = async (
  ids: SharedDataStoresIdsInput[]
): Promise<{ err: any }> => {
  const datastores = await Datastore.find({
      where: { id: Any(ids.map((i) => i.dataStoreId)) },
    }),
    users = await User.find({ where: { id: Any(ids.map((i) => i.userId)) } });

  for (const sharedDatastore of ids) {
    const datastore = datastores.find(
        (d) => d.id === sharedDatastore.dataStoreId
      ),
      user = users.find((d) => d.id === sharedDatastore.userId);

    if (!datastore || !user) continue;

    const { stderr: removeUserFromGroup } = await exec(
      `gpasswd -d ${user.osUserName} ${fsPath.basename(datastore.basePath)}`
    );
    if (removeUserFromGroup) return { err: removeUserFromGroup };
  }

  return { err: false };
};

export const groups = { add: addUsersToGroup, remove: removeUsersFromGroup };
