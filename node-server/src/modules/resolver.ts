import { ApolloError, gql } from "apollo-server-express";
import fs from "fs-extra";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getOrCreateApolloClient, getOrCreateConnection } from "../utils/nodes/client";
import { createUser } from "../utils/createUser";
import { createDatastoreFolder } from "../utils/datastore/createDatastoreFolder";
import { getDatastoreSizes } from "../utils/datastore/getDatastoreSizes";
import { addToGroup, createGroup, removeFromGroup } from "../utils/datastore/handleGroups";
import { exec } from "../utils/exec";
import { isSubDir } from "../utils/isSubDir";
import { createSSHClientForNode } from "../utils/nodes/createSSHClient";
import { CopyAndMoveInput } from "./CopyAndMoveInput";
import { CreateDatastoreInput } from "./CreateDatastoreInput";
import { DeletePaths } from "./DeletePaths";
import { GetDatastoreSizes, GetDatastoreSizesInput } from "./GetDatastoreSizes";
import { SetupNodeInput } from "./SetupNodeInput";
import { Tree } from "./Tree/Tree";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";
import { DeleteMutation, DeleteOnHostMutation } from "./DeleteMutation";
import { updateOwnership } from "../utils/datastore/updateOwnership";

@Resolver()
export class resolver {
	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean, { nullable: true })
	async setupNode(@Arg("data", () => SetupNodeInput) { loginName, password, token, id }: SetupNodeInput): Promise<boolean | null> {
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

	@Query(() => [GetDatastoreSizes])
	getDatastoresSizes(@Arg("datastores", () => [GetDatastoreSizesInput]) datastores: GetDatastoreSizesInput[]) {
		return getDatastoreSizes(datastores)
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

	@Mutation(() => Boolean, { nullable: true })
	async updateOwnership(
		@Arg("loginName") loginName: string,
		@Arg("datastoreName") datastoreName: string,
		@Arg("path") path: string
	) {
		return await updateOwnership(loginName, datastoreName, path)
	}

	@Query(() => Tree, { nullable: true })
	async queryTree(
		@Arg("path") path: string,
		@Arg("basePath") basePath: string,
		@Arg("depth") depth: number,
		@Arg("directoryTree") directoryTree: boolean,
	) {
		return await new Tree().init(path, basePath, depth, directoryTree)
	}

	@Mutation(() => Boolean, { nullable: true })
	async createDir(
		@Arg("path") path: string,
		@Arg("datastoreName") datastoreName: string,
		@Arg("loginName") loginName: string,
	) {
		try {
			fs.mkdirSync(path);
			await exec(`chown ${loginName}:${datastoreName} "${path}"`);
			return true
		} catch (err) {
			console.log(err)
			return false
		}

	}

	@Mutation(() => Boolean, { nullable: true })
	delete(@Arg("paths", () => [DeletePaths]) paths: DeletePaths[]) {
		try {
			for (const { path, type } of paths) {
				if (type === "file") fs.rmSync(path)
				else fs.rmdirSync(path, { recursive: true })
			}

			return true
		} catch (err) {
			console.log(err)
			return null
		}
	}

	@Mutation(() => Boolean, { nullable: true })
	async copyAndMove(@Arg("data", () => CopyAndMoveInput) { type, remote, srcNode, downloadFiles, downloadDirectories, srcDatastoreId, datastoreName, datastoreBasePath, nodeLoginName }: CopyAndMoveInput) {
		if (!remote) {
			for (const { remote, local } of [...downloadFiles, ...downloadDirectories]) {
				switch (type) {
					case "move": {
						if (isSubDir(remote, local)) {
							console.log("Cannot move inside itself")
							continue
						}

						fs.moveSync(remote, local)
						break
					}
					case "copy": {
						fs.copySync(remote, local, { recursive: true });
						break
					}
				}
			}
		} else {
			try {
				const client = await createSSHClientForNode(srcNode);

				await Promise.all([
					client.download.files(downloadFiles),
					client.download.directories(downloadDirectories),
				])

				if (type === "move") {
					const client = srcNode.hostNode ?
						getOrCreateConnection().client :
						getOrCreateApolloClient(`http://${srcNode.ip}:${srcNode.port}/graphql`)

					const { errors } = await client.mutate({
						mutation: srcNode.hostNode ? DeleteOnHostMutation : DeleteMutation,
						variables: {
							datastoreId: srcDatastoreId,
							paths: [...downloadDirectories, ...downloadFiles].map(({ type, remote }) => ({ path: remote, type }))
						}
					})

					if (errors) {
						console.log(errors)
						return null
					}
				}
			} catch (err) {
				console.log(err)
				return null
			}
		}

		await updateOwnership(nodeLoginName, datastoreName, datastoreBasePath)

		return true
	}
}