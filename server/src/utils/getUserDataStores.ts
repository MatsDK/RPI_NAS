import { getConnection } from "typeorm";
import { Datastore } from "../entity/Datastore";

// SELECT * FROM datastore d LEFT JOIN shared_data_store s ON s."dataStoreId"=d.id
// WHERE d."userId"=$1 OR s.id=$1
export const getUserDataStores = (userId: number) =>
  getConnection()
    .getRepository(Datastore)
    .createQueryBuilder("d")
    .leftJoin("shared_data_store", "s", `s."dataStoreId"=d.id`)
    .where("d.userId=:id OR s.userId=:id", { id: userId })
    .getMany();
