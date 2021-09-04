import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../types";
import { User } from "../entity/User";
import { createTokens } from "../utils/createTokens";
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from "../constants";

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req, res } },
  next
) => {
  const { "access-token": accessToken, "refresh-token": refreshToken } =
    req.cookies;

  if (!accessToken && !refreshToken) return null;

  try {
    const decoded: any = verify(
      accessToken || "",
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (req as any).userId = decoded.userId;
    return next();
  } catch {}

  let decodedRefreshToken: any;

  try {
    decodedRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch {
    return null;
  }

  if (decodedRefreshToken) (req as any).userId = decodedRefreshToken.userId;

  const user = await User.findOne(decodedRefreshToken.userId);
  if (!user) return null;

  (req as any).user = user;

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    createTokens(user);

  res.cookie("refresh-token", newRefreshToken, {
    maxAge: MAX_AGE_REFRESH_TOKEN,
  });
  res.cookie("access-token", newAccessToken, {
    maxAge: MAX_AGE_ACCESS_TOKEN,
  });

  return next();
};
