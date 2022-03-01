import { compare, hash } from "bcrypt";
import { createWriteStream } from "fs";
import fs from "fs-extra";
import { GraphQLUpload } from "graphql-upload";
import fsPath from "path";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { getConnection, ILike, In, Not } from "typeorm";
import { IMGS_FOLDER } from "../../constants";
import { Datastore } from "../../entity/Datastore";
import { FriendRequest } from "../../entity/FriendRequest";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { getUser } from "../../middleware/getUser";
import { MyContext } from "../../types/Context";
import { Upload } from "../../types/Upload";
import { createTokens } from "../../utils/createTokens";
import { createUser } from "../../utils/createUser";
import { FriendsQueryReturn } from "./FriendsQueryReturn";
import { RegisterInput } from "./RegisterInput";
import { Node } from "../../entity/CloudNode";

@Resolver()
export class UserResolver {
	@Mutation(() => User, { nullable: true })
	async login(
		@Arg("email") email: string,
		@Arg("password") password: string,
		@Ctx() { res }: MyContext
	): Promise<User | null> {
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error("Invalid email address")

		const valid = await compare(password, user.password);
		if (!valid) throw new Error("Incorrect password")

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

	@Mutation(() => User, { nullable: true })
	async register(
		@Arg("data") { email, password, userName }: RegisterInput
	): Promise<User | null> {
		const hashedPassword = await hash(password, 10),
			osUserName = userName.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
			usersCount = await User.count();

		const user = await User.create({
			email,
			userName,
			password: hashedPassword,
			osUserName,
			isAdmin: usersCount === 0
		}).save();

		const { err } = await createUser(osUserName, password, false);
		if (err) {
			await User.delete({ id: user.id });
			throw new Error("Invalid username");
		}
		const host = await Node.findOne({ where: { hostNode: true } })
		if (host) {
			host.initializedUsers.push(user.id)
			await host.save()
		}

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
			where: { id: In(req.user?.friendsIds || []) },
		});

		ret.friendsRequest = await getConnection()
			.getRepository(User)
			.createQueryBuilder("u")
			.innerJoin("friend_request", "f", `u.id=f."userId1"`)
			.where(`f."userId2"=:id `, { id: req.userId })
			.getMany();

		return ret;
	}

	@UseMiddleware(isAuth, getUser)
	@Query(() => [User], { nullable: true })
	getFriends(@Ctx() { req }: MyContext): Promise<User[]> {
		return User.find({
			where: { id: In(req.user?.friendsIds || []) },
		});
	}

	@UseMiddleware(isAuth)
	@Query(() => [Datastore], { nullable: true })
	getMyDatastores(@Ctx() { req }: MyContext): Promise<Datastore[]> {
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
