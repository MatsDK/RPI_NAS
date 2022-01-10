import { MiddlewareFn } from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types/Context";

export const getUser: MiddlewareFn<MyContext> = async (
  { context: { req } },
  next
) => {
  if (req.user) return next();

  if (req.userId != null)
    req.user = await User.findOne({
      where: { id: req.userId },
    });

  return next();
};
