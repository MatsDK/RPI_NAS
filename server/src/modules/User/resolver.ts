import { compare, hash } from "bcrypt";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection, ILike, In, Not } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { FriendRequest } from "../../entity/FriendRequest";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { MyContext } from "../../types";
import { createTokens } from "../../utils/createTokens";
import { FriendsQueryReturn } from "./FriendsQueryReturn";
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
    return req.user;
  }

  @UseMiddleware(isAuth, getUser)
  @Query(() => FriendsQueryReturn, { nullable: true })
  async friends(@Ctx() { req }: MyContext): Promise<FriendsQueryReturn> {
    const ret = new FriendsQueryReturn();

    ret.friends = await User.find({
      where: { id: In(req.user.friendsIds) },
    });

    ret.friendsRequest = await getConnection()
      .getRepository(User)
      .createQueryBuilder("u")
      .innerJoin("friend_request", "f", `u.id=f."userId1"`)
      .where(`f."userId2"=:id `, { id: req.userId })
      .getMany();

    return ret;
  }

  @UseMiddleware(isAuth)
  @Query(() => [Datastore], { nullable: true })
  getMyDataStores(@Ctx() { req }: MyContext): Promise<Datastore[]> {
    return Datastore.find({ where: { userId: req.userId } });
  }

  @UseMiddleware(isAuth)
  @Query(() => [User], { nullable: true })
  getUsersByName(
    @Arg("name") userName: string,
    @Ctx() { req }: MyContext
  ): Promise<User[]> {
    return User.find({
      where: { userName: ILike(`${userName}%`), id: Not(req.userId) },
      take: 25,
    });
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async setDefaultDownloadPath(
    @Arg("path") path: string,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await User.update({ id: req.userId }, { defaultDownloadPath: path });

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async sendFriendRequest(
    @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ) {
    if (
      req.userId !== userId &&
      !(await FriendRequest.findOne({
        where: {
          userId1: req.userId,
          userId2: userId,
        },
      }))
    )
      await FriendRequest.create({
        userId1: req.userId,
        userId2: userId,
      }).save();

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async acceptFriendRequest(
    @Arg("userId") userId: number,
    @Ctx() { req }: MyContext
  ) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(FriendRequest)
      .where(
        `("userId1" = :id1 AND "userId2" = :id2) OR ("userId1" = :id2 AND "userId2" = :id1) `,
        { id1: userId, id2: req.userId }
      )
      .execute();

    const users = await User.find({ where: { id: In([req.userId, userId]) } });
    const promiseList = [];

    for (const user of users) {
      user.friendsIds.push(user.id == userId ? req.userId : userId);
      promiseList.push(user.save());
    }

    await Promise.all(promiseList);

    return true;
  }
}
