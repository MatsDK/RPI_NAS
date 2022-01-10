import { MiddlewareFn } from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types/Context";

export const isAdmin: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (req.user) return req.user.isAdmin ? next() : null;
  if (req.userId == null) return null;

  req.user = await User.findOne({ where: { id: req.userId } });

  return req.user?.isAdmin ? next() : null;
};
