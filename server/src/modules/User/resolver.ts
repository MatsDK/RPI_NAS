import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../entity/User";
import { compare, hash } from "bcrypt";
import { MyContext } from "../../types";
import { createTokens } from "../../utils/createTokens";
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from "../../constants";
import { isAuth } from "../../middleware/auth";
import { RegisterInput } from "./RegisterInput";

@Resolver()
export class UserResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const valid = await compare(password, user.password);
    if (!valid) return null;

    const { accessToken, refreshToken } = createTokens(user);

    res.cookie("access-token", accessToken, { maxAge: MAX_AGE_ACCESS_TOKEN });
    res.cookie("refresh-token", refreshToken, {
      maxAge: MAX_AGE_REFRESH_TOKEN,
    });

    return user;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() { res }: MyContext): Promise<boolean> {
    res.clearCookie("refresh-token");
    res.clearCookie("access-token");

    return true;
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, password, userName }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);

    return await User.create({
      email,
      userName,
      password: hashedPassword,
    }).save();
  }
}
