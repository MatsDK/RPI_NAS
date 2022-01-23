import { Resolver, Mutation, Query, Arg } from "type-graphql";
import { Node } from "./SetupNodeInput";
import { CreateDatastoreInput } from "./CreateDatastoreInput";
import { createUser } from "../utils/createUser";
import { getOrCreateConnection } from "../utils/client";
import { ApolloError } from "apollo-server-express";
import { createDatastoreFolder } from "../utils/datastore/createDatastoreFolder"
import { createGroup, addToGroup } from "../utils/datastore/handleGroups";
import { GetDatastoreSizes, GetDatastoreSizesInput } from "./GetDatastoreSizes";
import { getDatastoreSizes } from "../utils/datastore/getDatastoreSizes";

@Resolver()
export class resolver {
	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async setupNode(@Arg("data", () => Node) { loginName, password, token, id }: Node): Promise<boolean | null> {
		const { err } = await createUser(loginName, password)
		if (err) throw new ApolloError(err)

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

	@Mutation(() => Boolean)
	async createDatastore(@Arg("data", () => CreateDatastoreInput) { path, groupName, ownerUserName, sizeInMB, ownerPassword, initOwner, hostLoginName }: CreateDatastoreInput): Promise<boolean> {
		if (initOwner) {
			try {
				const { err } = await createUser(ownerUserName, ownerPassword)
				if (err) throw new ApolloError(err)
			} catch { }
		}

		const { err: createGroupErr } = await createGroup(groupName, ownerUserName);
		if (createGroupErr) throw new ApolloError(createGroupErr);

		const { err: createDatastoreFolderErr } = await createDatastoreFolder(path, sizeInMB, { folderUser: hostLoginName, folderGroup: groupName })
		if (createDatastoreFolderErr) throw new ApolloError(createDatastoreFolderErr);

		return true
	}

	@Query(() => [GetDatastoreSizesInput])
	getDatastoresSizes(@Arg("datastores", () => [GetDatastoreSizesInput]) datastores: [GetDatastoreSizesInput]) {
		return datastores.length ? getDatastoreSizes(datastores) : []
	}

	@Mutation(() => Boolean, { nullable: true })
	async initUser(@Arg("userName") userName: string, @Arg("password") password: string, @Arg("groupName") groupName: string): Promise<boolean | null> {
		try {
			await createUser(userName, password)
			await addToGroup(userName, groupName)
		} catch (e) {
			console.log(e)
			return null
		}

		return true
	}
}