import { compare, hash } from "bcrypt";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ILike, In, Not } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { MyContext } from "../../types";
import { createTokens } from "../../utils/createTokens";
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

    // res.cookie("access-token", accessToken, {
    //   maxAge: MAX_AGE_ACCESS_TOKEN,
    // });
    // res.cookie("refresh-token", refreshToken, {
    //   maxAge: MAX_AGE_REFRESH_TOKEN,
    // });

    res.setHeader(
      "Cookie",
      `refresh-token=${refreshToken}; access-token=${accessToken}`
    );

    return user;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() { res }: MyContext): Promise<boolean> {
    res.clearCookie("refresh-token");
    res.clearCookie("access-token");

    res.setHeader("Cookie", `refresh-token=; access-token=`);

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

  @UseMiddleware(isAuth, getUser)
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    return (req as any).user;
  }

  @UseMiddleware(isAuth, getUser)
  @Query(() => [User], { nullable: true })
  friends(@Ctx() { req }: MyContext): Promise<User[]> {
    return User.find({ where: { id: In((req as any).user.friendsIds) } });
  }

  @UseMiddleware(isAuth)
  @Query(() => [Datastore], { nullable: true })
  getMyDataStores(@Ctx() { req }: MyContext): Promise<Datastore[]> {
    return Datastore.find({ where: { userId: (req as any).userId } });
  }

  @UseMiddleware(isAuth)
  @Query(() => [User], { nullable: true })
  getUsersByName(
    @Arg("name") userName: string,
    @Ctx() { req }: MyContext
  ): Promise<User[]> {
    return User.find({
      where: { userName: ILike(`${userName}%`), id: Not((req as any).userId) },
    });
  }
}
