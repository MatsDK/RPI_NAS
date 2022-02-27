import fsPath from "path";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { v4 } from "uuid";
import { Node } from "../../entity/CloudNode";
import { Datastore } from "../../entity/Datastore";
import { isAuth } from "../../middleware/auth";
import { getDataStoreAndNode } from "../../middleware/getDataStoreNode";
import { MyContext } from "../../types/Context";
import { Upload } from "../../types/Upload";
import { hasAccessToDatastore } from "../../utils/dataStore/hasAccessToDatastore";
import { downloadSessions } from "../../utils/transferData/downloadSessions";
import { uploadFiles, uploadFilesToRemote } from "../../utils/transferData/uploadFiles";
import { DownloadSessionInput } from "./DownloadSessionInput";
import { DownloadSessionReturn } from "./DownloadSessionReturn";
import { UploadSessionInput } from "./UploadSessionInput";
import { UploadSessionReturn } from "./UploadSessionReturn";
import { FileUpload, GraphQLUpload, Upload as TEST } from "graphql-upload"

@Resolver()
export class TreeResolver {
	@UseMiddleware(isAuth, getDataStoreAndNode)
	@Mutation(() => UploadSessionReturn, { nullable: true })
	createUploadSession(
		@Arg("data", () => UploadSessionInput)
		{ uploadPath }: UploadSessionInput,
		@Ctx() { req }: MyContext
	): UploadSessionReturn {
		const dataStore = req.datastore as Datastore,
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
	async createDownloadSession(
		@Arg("data", () => DownloadSessionInput)
		{ downloadPaths, type }: DownloadSessionInput,
		@Ctx() { req }: MyContext
	): Promise<DownloadSessionReturn | null> {
		const returnObj = new DownloadSessionReturn(),
			datastore = req.datastore,
			node = req.localNode

		if (!datastore || !node)
			return null

		if (!(await hasAccessToDatastore(datastore.id, req.userId, datastore.userId)))
			return null

		switch (type) {
			case "http":
				const id = v4();

				downloadSessions.addSession(
					id,
					{
						paths: downloadPaths.map((obj) => ({
							...obj,
							path: fsPath.join(datastore.basePath, obj.path),
						})),
						datastore,
						node
					}
				);

				returnObj.id = id;
				break;

			case "SSH":
				const localNode = req.localNode as Node;

				returnObj.data = downloadPaths.map(({ path, ...rest }) => ({
					...rest,
					path: fsPath.join(datastore.basePath, path),
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
		@Arg("files", () => [GraphQLUpload]) files: Upload[],
		@Arg("datastoreId") datastoreId: number,
		@Arg("path") path: string,
	) {
		if (!files.length) return null

		const datastore = await Datastore.findOne({ where: { id: datastoreId } })
		if (!datastore || !(await hasAccessToDatastore(datastoreId, req.userId, datastore.userId))) return null

		const node = await Node.findOne({ where: { id: datastore.localNodeId } })
		if (!node) return null

		if (node.hostNode) {
			const { err } = await uploadFiles({ files, path: fsPath.join(datastore.basePath, path) })
			if (err) {
				console.log(err)
				return null
			}
		} else {
			const { err } = await uploadFilesToRemote({ datastore, node, files, path })
			if (err) {
				console.log(err)
				return null
			}
		}

		return true
	}
}
