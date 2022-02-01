import fs from "fs-extra";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { updateOwnership } from "../../utils/datastore/updateOwnership";
import { exec } from "../../utils/exec";
import { isSubDir } from "../../utils/isSubDir";
import { getOrCreateApolloClient, getOrCreateConnection } from "../../utils/nodes/client";
import { createSSHClientForNode } from "../../utils/nodes/createSSHClient";
import { CopyAndMoveInput } from "./CopyAndMoveInput";
import { DeleteMutation, DeleteOnHostMutation } from "./DeleteMutation";
import { DeletePaths } from "./DeletePaths";
import { Tree } from "./Tree";

@Resolver()
export class TreeResolver {
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