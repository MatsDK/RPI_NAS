import { MiddlewareFn } from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types";

export const getUser: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if ((req as any).user) return next();

  if ((req as any).userId != null)
    (req as any).user = await User.findOne({
      where: { id: (req as any).userId },
    });

  return next();
};
