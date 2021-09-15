import { MiddlewareFn } from "type-graphql";
import { getConnection } from "typeorm";
import { MyContext } from "../types";

export const checkPermissions: MiddlewareFn<MyContext> = async (
  { context: { req }, args: { data } },
  next
) => {
  if (data.dataStoreId == null) return next();

  const [res] = await getConnection().query(
    `SELECT (SELECT COUNT(*) FROM datastore WHERE "id"=$1 AND "userId"=$2) AS count1,
		(SELECT COUNT(*) FROM shared_data_store WHERE "dataStoreId"=$1 AND "userId"=$2) AS count2`,
    [data.dataStoreId, (req as any).userId]
  );

  return Number(res.count1) + Number(res.count2) >= 1 ? next() : null;
};
