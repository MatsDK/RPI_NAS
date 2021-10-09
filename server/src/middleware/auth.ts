import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../types";
import { User } from "../entity/User";
import { createTokens } from "../utils/createTokens";
import cookie from "cookie";

export const isAuth: MiddlewareFn<MyContext> = async (
  { context: { req, res } },
  next
) => {
  let { "access-token": accessToken, "refresh-token": refreshToken } =
    Object.keys(req.cookies).length
      ? req.cookies
      : cookie.parse((req.headers["authorization"] as string) || "");

  if (!Object.keys(req.cookies).length) {
    const cookiesMap: Map<string, string> = new Map();

    ((req.headers["authorization"] as string) || "")
      .split(";")
      .map((x: string) => x.split("="))
      .map(([key, v]: any) => cookiesMap.set(key?.trim(), v?.trim()));

    accessToken = cookiesMap.get("access-token");
    refreshToken = cookiesMap.get("refresh-token");
  }

  if (!accessToken && !refreshToken) return null;

  try {
    const decoded: any = verify(
      accessToken || "",
      process.env.ACCESS_TOKEN_SECRET as string
    );

    req.userId = decoded.userId;
    return next();
  } catch {}

  let decodedRefreshToken: any;

  try {
    decodedRefreshToken = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
  } catch (e) {
    return null;
  }

  if (decodedRefreshToken) req.userId = decodedRefreshToken.userId;

  const user = await User.findOne(decodedRefreshToken.userId);
  if (!user) return null;

  (req as any).user = user;

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    createTokens(user);

  res.setHeader(
    "Cookie",
    `refresh-token=${newRefreshToken}; access-token=${newAccessToken}`
  );

  // res.cookie("refresh-token", newRefreshToken, {
  //   maxAge: MAX_AGE_REFRESH_TOKEN,
  // });
  // res.cookie("access-token", newAccessToken, {
  //   maxAge: MAX_AGE_ACCESS_TOKEN,
  // });

  return next();
};
