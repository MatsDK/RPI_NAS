import fsPath from "path";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { getDataStoreAndNode } from "../../middleware/getDataStoreNode";
import { MyContext } from "../../types/Context";
import { GraphQLUpload } from "graphql-upload";
import { Upload } from "../../types/Upload";
import { downloadSessions } from "../../utils/transferData/downloadSessions";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { DownloadSessionReturn } from "./DownloadSessionReturn";
import { UploadSessionInput } from "./UploadSessionInput";
import { UploadSessionReturn } from "./UploadSessionReturn";
import { createWriteStream } from "fs";
import { hasAccessToDatastore } from "../../utils/dataStore/hasAccessToDatastore";

@Resolver()
export class TreeResolver {
	@UseMiddleware(isAuth, getDataStoreAndNode)
	@Mutation(() => UploadSessionReturn, { nullable: true })
	createUploadSession(
		@Arg("data", () => UploadSessionInput)
		{ uploadPath }: UploadSessionInput,
		@Ctx() { req }: MyContext
	): UploadSessionReturn {
		const dataStore = req.dataStore as Datastore,
			localNode = req.localNode as Node,
			returnObj = new UploadSessionReturn();

		returnObj.uploadPath = fsPath.join(dataStore.basePath, uploadPath);

		returnObj.hostIp = localNode.ip;
		returnObj.password = localNode.password;
		returnObj.username = localNode.loginName;
		returnObj.port = localNode.sshPort!;

		return returnObj;
	}

	@UseMiddleware(isAuth, getDataStoreAndNode)
	@Mutation(() => DownloadSessionReturn, { nullable: true })
	createDownloadSession(
		@Arg("data", () => DownloadSessionInput)
		{ downloadPaths, type }: DownloadSessionInput,
		@Ctx() { req }: MyContext
	): DownloadSessionReturn {
		const returnObj = new DownloadSessionReturn(),
			dataStore = req.dataStore as Datastore;

		switch (type) {
			case "http":
				const id = v4();

				downloadSessions.addSession(
					id,
					downloadPaths.map((obj) => ({
						...obj,
						path: fsPath.join(dataStore.basePath, obj.path),
					}))
				);

				returnObj.id = id;
				break;

			case "SSH":
				const localNode = req.localNode as Node;

				returnObj.data = downloadPaths.map(({ path, ...rest }) => ({
					...rest,
					path: fsPath.join(dataStore.basePath, path),
				}));

				returnObj.hostIp = localNode.ip;
				returnObj.password = localNode.password;
				returnObj.username = localNode.loginName;
				returnObj.port = localNode.sshPort!;
				break;

			default:
				break;
		}

		return returnObj;
	}

	@UseMiddleware(isAuth)
	@Mutation(() => Boolean, { nullable: true })
	async uploadFiles(
		@Ctx() { req }: MyContext,
		@Arg("files", () => FileList) files: Upload[],
		@Arg("datastoreId") datastoreId: number,
		@Arg("path") path: string,
	) {
		if (!files.length) return null

		const datastore = await Datastore.findOne({ where: { id: datastoreId } })
		if (!datastore || !(await hasAccessToDatastore(datastoreId, req.userId, datastore.userId))) return null

		const node = await Node.findOne({ where: { id: datastore.localNodeId } })
		if (!node) return null

		if (node.hostNode) {
			for (let file of files) {
				file = await file;
				const filePath = fsPath.join(datastore.basePath, path, file.filename)

				try {
					await new Promise((res, rej) => {
						file.createReadStream()
							.pipe(createWriteStream(filePath))
							.on("finish", () => res(null))
							.on("error", err => rej(err.message))
					})
				} catch (err) {
					console.log(err)
				}
			}
		}

		return true
	}
}
