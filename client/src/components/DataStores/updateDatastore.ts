import { Datastore, User } from "generated/apolloComponents";

const arrayChanged = (a1: any[] = [], a2: any[] = []): boolean =>
  a1.sort().join(",") !== a2.sort().join(",");

const sharedUsersChanged = (
  oSharedUsers: User[] = [],
  uSharedUsers: User[] = []
) =>
  arrayChanged(
    oSharedUsers.map(({ id }) => id),
    uSharedUsers.map(({ id }) => id)
  );

export const datastoreUpdated = (
  oDatastore: Datastore | null,
  uDatastore: Datastore | null
): boolean =>
  uDatastore?.name !== oDatastore?.name ||
  uDatastore?.owner?.smbEnabled !== oDatastore?.owner?.smbEnabled ||
  sharedUsersChanged(oDatastore?.sharedUsers, uDatastore?.sharedUsers) ||
  arrayChanged(oDatastore?.allowedSMBUsers, uDatastore?.allowedSMBUsers);

export const getUpdateObj = (
  oDatastore: Datastore | null,
  uDatastore: Datastore | null
): any => {
  const updateObj: any = {
    name: null,
    ownerSMBEnabled: null,
    sharedUsers: null,
    allowedSMBUsers: null,
  };

  if (oDatastore?.name != uDatastore?.name && uDatastore?.name != null)
    updateObj.name = uDatastore.name;

  if (oDatastore?.owner?.smbEnabled != uDatastore?.owner?.smbEnabled)
    updateObj.ownerSMBEnabled = uDatastore?.owner?.smbEnabled;

  if (sharedUsersChanged(oDatastore?.sharedUsers, uDatastore?.sharedUsers))
    updateObj.sharedUsers = uDatastore?.sharedUsers.map(({ id }) => Number(id));

  if (arrayChanged(oDatastore?.allowedSMBUsers, uDatastore?.allowedSMBUsers))
    updateObj.allowedSMBUsers = [
      ...(uDatastore?.allowedSMBUsers
        .filter((v) => !oDatastore?.allowedSMBUsers?.includes(v))
        .map((id) => ({ userId: id, allowed: true })) || []),
      ...(oDatastore?.allowedSMBUsers
        ?.filter((v) => !uDatastore?.allowedSMBUsers?.includes(v))
        .map((id) => ({ userId: id, allowed: false })) || []),
    ];

  return updateObj;
};
