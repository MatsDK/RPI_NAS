import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { DatastoreService, ServiceNames } from "../../entity/DatastoreService";
import { updateSMB } from "./updateSMB";

interface toggleServiceProps {
  serviceName: string;
  datastore: Datastore;
  userId: number;
  host: Node;
}

export const toggleService = async ({
  serviceName,
  datastore,
  userId,
  host,
}: toggleServiceProps): Promise<boolean> => {
  switch (serviceName) {
    case "SMB": {
      const obj: any = {
        serviceName: ServiceNames.SMB,
        datastoreId: datastore.id,
        userId,
      };
      const service = await DatastoreService.findOne({ where: obj });

      service
        ? await DatastoreService.delete(obj)
        : datastore.allowedSMBUsers.includes(userId) &&
          (await DatastoreService.insert(obj));

      updateSMB(host.loginName).then((res) => {
        console.log(res);
      });

      break;
    }
  }

  return true;
};
