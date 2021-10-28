import { compare, hash } from "bcrypt";
import { createUser } from "../../utils/createUser";
import { createWriteStream } from "fs";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import fsPath from "path";
import { IMGS_FOLDER } from "../../constants";
import fs from "fs-extra";
import { getConnection, ILike, In, Not } from "typeorm";
import { Datastore } from "../../entity/Datastore";
import { GraphQLUpload } from "graphql-upload";
import { FriendRequest } from "../../entity/FriendRequest";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { Node } from "../../entity/CloudNode";
import { MyContext } from "../../types/Context";
import { Upload } from "../../types/Upload";
import { createTokens } from "../../utils/createTokens";
import { FriendsQueryReturn } from "./FriendsQueryReturn";
import { RegisterInput } from "./RegisterInput";
import { updateSMB } from "../../utils/services/updateSMB";

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
    const hashedPassword = await hash(password, 10),
      osUserName = userName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
      osUserName,
    }).save();

    createUser(osUserName, password).then((res: any) => {
      if (res.err) console.log(res.err);
    });

    return user;
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

    const users = await User.find({
      where: { id: In([req.userId, userId]) },
    });
    const promiseList = [];

    for (const user of users) {
      user.friendsIds.push(user.id == userId ? req.userId : userId);
      promiseList.push(user.save());
    }

    await Promise.all(promiseList);

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean, { nullable: true })
  async UploadProfilePicture(
    @Arg("file", () => GraphQLUpload) { createReadStream }: Upload,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const path = fsPath.join(IMGS_FOLDER, `${req.userId}.png`);

    if (fs.pathExistsSync(path)) fs.removeSync(path);

    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(path))
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
