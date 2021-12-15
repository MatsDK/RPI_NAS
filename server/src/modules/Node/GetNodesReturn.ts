import { ObjectType, Field } from "type-graphql";
import { Node } from "../../entity/CloudNode";
import { NodeRequest } from "../../entity/NodeRequest";

@ObjectType()
export class GetNodesReturn {
	@Field(() => [Node])
	nodes: Node[]

	@Field(() => [NodeRequest])
	nodeRequests: NodeRequest[]
}