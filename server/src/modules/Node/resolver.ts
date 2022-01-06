import { Query, Resolver, UseMiddleware, Mutation, Arg, Ctx } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { AcceptNodeRequestInput } from "./AcceptNodeRequestInput"
import { Node } from "../../entity/CloudNode";
import { NodeRequest } from "../../entity/NodeRequest";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";
import { CreateNodeInput } from "./CreateNodeInput";
import { createUser } from "../../utils/createUser";
import { v4 } from "uuid";
import { MyContext } from "../../types/Context"
import { getOrCreateNodeClient } from "../../utils/nodes/nodeClients";
import { gql } from "@apollo/client/core";
import { GetNodesReturn } from "./GetNodesReturn";
import { pingNodes } from "../../utils/nodes/pingNodes";

const SETUPNODE_MUTATION = gql`
mutation SetupNodeMutation($data: Node!) {
	setupNode(data: $data)
}
`

@Resolver()
export class NodeResolver {
	@UseMiddleware(isAuth, isAdmin)
	@Query(() => GetNodesReturn, { nullable: true })
	async getNodes(): Promise<GetNodesReturn> {
		const ret = new GetNodesReturn()
		ret.nodes = await pingNodes(await Node.find());
		ret.nodeRequests = await NodeRequest.find();
		return ret
	}

	@UseMiddleware(isAuth, isAdmin)
	@Mutation(() => Node, { nullable: true })
	async createNode(@Arg("data") { name, loginName, password }: CreateNodeInput): Promise<Node | null> {
		if (!name.trim() || !loginName.trim() || !password.trim()) return null;

		const osLoginName = loginName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
		if ((await Node.count({ where: { hostNode: true } })) || (await User.count({ where: { osUserName: osLoginName } }))) return null

		const users = await User.find({ select: ["id"] });
		const node = await Node.create({
			name: name.trim(),
			loginName: osLoginName,
			password,
			port: 4000,
			ip: process.env.HOST_IP,
			basePath: `/home/${osLoginName}`,
			hostNode: true,
			initializedUsers: users.map(({ id }) => id)
		}).save()

		const { err } = await createUser(osLoginName, password, false);
		if (err) {
			console.log(err);
			Node.delete({ id: node.id });
			throw new ApolloError(err)
		}

		return node;
	}

	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean)
	async createNodeRequest(@Ctx() { req }: MyContext, @Arg("ip") ip: string, @Arg("port") port: number): Promise<boolean> {
		const id_token = req.headers["authorization"]?.split("_")
		if (id_token?.length == 2) {
			const [id, token] = id_token

			if (token != null && id != null && (await Node.count({ where: { token, id: Number(id) } })))
				return true
		}

		if (!(await NodeRequest.count({ where: { ip, port } })))
			await NodeRequest.insert([{ ip, port }])

		return false
	}

	@UseMiddleware(isAuth, isAdmin)
	@Mutation(() => Boolean)
	async deleteNodeRequest(@Arg("id") id: number): Promise<boolean> {
		await NodeRequest.delete({ id });

		return true
	}

	@UseMiddleware(isAuth, isAdmin)
	@Mutation(() => Node, { nullable: true })
	async acceptNodeRequest(@Arg("data") { id, name, loginName, password }: AcceptNodeRequestInput): Promise<Node | null> {
		const osLoginName = loginName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
		if (!name.trim() || !osLoginName.trim() || !password.trim()) return null;

		const request = await NodeRequest.findOne({ where: { id } });
		if (!request) return null;

		if ((await User.count({ where: { osUserName: osLoginName } }))) return null

		const node = await Node.create({
			initializedUsers: [],
			name: name.trim(),
			loginName: osLoginName,
			password,
			port: request.port,
			ip: request.ip,
			basePath: `/home/${osLoginName}`,
			hostNode: false,
			token: v4(),
		}).save();
		const deleteNode = () => Node.delete({ id: node.id });

		const nodeClient = await getOrCreateNodeClient({ node, ping: true });
		if (!nodeClient) {
			await deleteNode()
			console.log("Could not connect to host")
			throw new ApolloError("Could not connect to host");
		}

		try {
			const res = await nodeClient.conn.mutate({ mutation: SETUPNODE_MUTATION, variables: { data: { ...node } } });
			if (!res.data?.setupNode) {
				console.log("failed to setup");
				await deleteNode();
				return null
			}
		} catch (e) {
			console.log(e);
			await deleteNode();
			return null
		}

		await NodeRequest.delete({ id: request!.id });
		return node
	}

	@Mutation(() => Boolean, { nullable: true })
	async createConnection(@Arg("uri") uri: string): Promise<boolean | null> {
		const client = await getOrCreateNodeClient({ uri, ping: true })
		return true
	}
}