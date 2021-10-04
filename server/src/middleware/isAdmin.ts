import { MiddlewareFn } from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types";

export const isAdmin: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if ((req as any).user) return (req as any).user.isAdmin ? next() : null;
  if (req.userId == null) return null;

  (req as any).user = await User.findOne({ where: { id: req.userId } });

  return (req as any).user.isAdmin ? next() : null;
};
