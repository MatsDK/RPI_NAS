import { Query, Resolver, UseMiddleware, Mutation, Arg } from "type-graphql";
import { Node } from "../../entity/CloudNode";
import { User } from "../../entity/User";
import { isAuth } from "../../middleware/auth";
import { isAdmin } from "../../middleware/isAdmin";
import { CreateNodeInput } from "./CreateNodeInput";
import { createUser } from "../../utils/createUser";

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
		const osLoginName = loginName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
		if ((await Node.count({ where: { hostNode: true } })) || (await User.count({ where: { osUserName: osLoginName } }))) return null

		const node = await Node.create({ name, loginName: osLoginName, password, port: 4000, host: process.env.HOST_IP, ip: process.env.HOST_IP, basePath: `/home/${loginName}`, hostNode: true }).save();

		const { err } = await createUser(osLoginName, password, false);
		if (err) {
			console.log(err);
			Node.delete({ id: node.id });
		}

		return node;
	}
}
