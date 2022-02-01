import { ApolloError } from "apollo-server-express";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { createUser } from "../../utils/createUser";
import { createDatastoreFolder } from "../../utils/datastore/createDatastoreFolder";
import { getDatastoreSizes } from "../../utils/datastore/getDatastoreSizes";
import { createGroup } from "../../utils/datastore/handleGroups";
import { updateOwnership } from "../../utils/datastore/updateOwnership";
import { CreateDatastoreInput } from "./CreateDatastoreInput";
import { GetDatastoreSizes, GetDatastoreSizesInput } from "./GetDatastoreSizes";

@Resolver()
export class DatastoreResolver {

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

	@Query(() => [GetDatastoreSizes])
	getDatastoresSizes(@Arg("datastores", () => [GetDatastoreSizesInput]) datastores: GetDatastoreSizesInput[]) {
		return getDatastoreSizes(datastores)
	}

	@Mutation(() => Boolean, { nullable: true })
	async updateOwnership(
		@Arg("loginName") loginName: string,
		@Arg("datastoreName") datastoreName: string,
		@Arg("path") path: string
	) {
		return await updateOwnership(loginName, datastoreName, path)
	}
}