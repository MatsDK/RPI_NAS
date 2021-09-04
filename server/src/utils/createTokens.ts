import { sign } from "jsonwebtoken";
import { User } from "../entity/User";

export const createTokens = (user: User) => ({
  refreshToken: sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  ),
  accessToken: sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  ),
});
