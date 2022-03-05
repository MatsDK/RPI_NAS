import { ApolloError } from "apollo-server-express";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { createUser } from "../../utils/createUser";
import { addToGroup, removeFromGroup } from "../../utils/datastore/handleGroups";
import { getOrCreateConnection } from "../../utils/nodes/client";
import { SetupNodeInput } from "./SetupNodeInput";

@Resolver()
export class NodeResolver {
	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async setupNode(@Arg("data", () => SetupNodeInput) { loginName, password, token, id }: SetupNodeInput): Promise<boolean | null> {
		const { err } = await createUser(loginName, password)
		if (err) {
			console.log(err)
			return false
		}

		const conn = getOrCreateConnection();
		conn.id = id;
		conn.token = token;
		conn.saveToken();
		conn.setHeadersCallback();

		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async connectRequest(): Promise<boolean | null> {
		getOrCreateConnection().connect()

		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async initUser(@Arg("userName") userName: string, @Arg("password") password: string, @Arg("groupNames", () => [String]) groupNames: string[]): Promise<boolean | null> {
		try {
			await createUser(userName, password)
			await addToGroup(userName, groupNames)
		} catch (err) {
			console.log(err)
			return null
		}

		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async addUsersToGroup(@Arg("newUsers", () => [String]) newUsers: string[], @Arg("removedUsers", () => [String]) removedUsers: string[], @Arg("groupName") groupName: string): Promise<boolean | null> {
		try {
			for (const newUser of newUsers) {
				try {
					await addToGroup(newUser, groupName)
				} catch (err) {
					console.log(err)
					continue
				}
			}

			for (const removedUser of removedUsers) {
				try {
					await removeFromGroup(removedUser, groupName)
				} catch (err) {
					console.log(err)
					continue
				}
			}
		} catch (err) {
			console.log(err)
			return null
		}

		return true
	}

	@Mutation(() => String, { nullable: true })
	setSessionToken(@Arg("token") token: string, @Arg("sessionToken") sessionToken: string) {
		const conn = getOrCreateConnection()
		if (conn.token == null || conn.token != token) return null

		conn.sessionToken = sessionToken
		return sessionToken
	}
}