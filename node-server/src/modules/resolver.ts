import { Resolver, Mutation, Query, Arg } from "type-graphql";
import { SetupNodeInput } from "./SetupNodeInput";
import { createUser } from "../utils/createUser";
import { getOrCreateConnection } from "../utils/client";
import { ApolloError } from "apollo-server-express";

@Resolver()
export class resolver {
	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async setupNode(@Arg("data", () => SetupNodeInput) { loginName, password, token, id }: SetupNodeInput): Promise<boolean | null> {
		const { err } = await createUser(loginName, password);

		if (err) throw new ApolloError(err);

		const conn = getOrCreateConnection();
		conn.id = id;
		conn.token = token;
		conn.saveToken();
		conn.setHeadersCallback();

		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async connectRequest(): Promise<boolean | null> {
		await getOrCreateConnection().connect()

		return true
	}
}
