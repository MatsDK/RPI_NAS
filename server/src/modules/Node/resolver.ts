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
import { getOrCreateNodeClient } from "../../utils/nodeClients";
import { gql } from "@apollo/client/core";

const SETUPNODE_MUTATION = gql`
mutation SetupNodeMutation($data: Node!) {
	setupNode(data: $data)
}
`

@Resolver()
export class NodeResolver {
	@UseMiddleware(isAuth, isAdmin)
	@Query(() => [Node], { nullable: true })
	getNodes(): Promise<Node[]> {
		return Node.find()
	}

	@UseMiddleware(isAuth, isAdmin)
	@Mutation(() => Node, { nullable: true })
	async createNode(@Arg("data") { name, loginName, password }: CreateNodeInput): Promise<Node | null> {
		if(!name.trim() || !loginName.trim() || !password.trim()) return null;

		const osLoginName = loginName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
		if ((await Node.count({ where: { hostNode: true } })) || (await User.count({ where: { osUserName: osLoginName } }))) return null

		const node = await Node.create({ name: name.trim(), loginName: osLoginName, password, port: 4000, host: process.env.HOST_IP, ip: process.env.HOST_IP, basePath: `/home/${osLoginName}`, hostNode: true }).save();

		const { err } = await createUser(osLoginName, password, false);
		if (err) {
			console.log(err);
			Node.delete({ id: node.id });
		}

		return node;
	}

	@Query(() => Boolean)
	ping() {
		return true
	}

	@Mutation(() => Boolean) 
	async createNodeRequest(@Ctx() { req }: MyContext, @Arg("ip") ip: string, @Arg("port") port: number): Promise<boolean> {
		console.log(req.headers);
		if((await Node.count({ where: { ip, port } }))) return true
	
		if (!(await NodeRequest.count({ where: { ip, port } }))) 
			await NodeRequest.insert([{ ip, port }])	

		return false
	}

	@UseMiddleware(isAuth, isAdmin)
	@Mutation(() => Node, { nullable: true }) 
	async acceptNodeRequest(@Arg("data") { id, name, loginName, password}: AcceptNodeRequestInput): Promise<Node | null> {
		if(!name.trim() || !loginName.trim() || !password.trim()) return null;

		const request = await NodeRequest.findOne({ where: { id } });
		if (!request) return null;

		const osLoginName = loginName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
		if ((await User.count({ where: { osUserName: osLoginName } }))) return null

		const node = await Node.create({ name: name.trim(), loginName: osLoginName, password, port: request.port, host: process.env.HOST_IP, ip: request.ip, basePath: `/home/${osLoginName}`, hostNode: false, token: v4() }).save();
		const deleteNode = () => Node.delete({ id: node.id });

		const nodeClient = await getOrCreateNodeClient(node);
		if(!nodeClient) {
			await deleteNode()
			throw new ApolloError("Could not connect to host");
			return null
		}

		try {
			const res = nodeClient.mutate({ mutation: SETUPNODE_MUTATION, variables: { data: node } });
			if(!res.data?.setupNode) {
				await deleteNode()
				return null
			}
		} catch(e) {
			console.log(e);
			await deleteNode();
			return null
		}

		await NodeRequest.delete({ id: request!.id });
		return node
	}
}
