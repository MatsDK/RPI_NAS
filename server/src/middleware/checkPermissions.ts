import { MiddlewareFn } from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "../types";

export const checkPermissions: MiddlewareFn<MyContext> = async (
  { context: { req }, args: { data, dataStoreId } },
  next
) => {
  const id = dataStoreId != null ? dataStoreId : data.dataStoreId;
  if (id == null) return next();

  const [res] = await getConnection().query(
    `SELECT (SELECT COUNT(*) FROM datastore WHERE "id"=$1 AND "userId"=$2) AS count1,
		(SELECT COUNT(*) FROM shared_data_store WHERE "dataStoreId"=$1 AND "userId"=$2) AS count2`,
    [id, (req as any).userId]
  );

  return Number(res.count1) + Number(res.count2) >= 1 ? next() : null;
};
