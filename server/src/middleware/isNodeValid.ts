import { MiddlewareFn } from "type-graphql";
import { Node } from "../entity/CloudNode";
import { MyContext } from "../types/Context";
import { getOrCreateNodeClient } from "../utils/nodes/nodeClients";

export const isNodeValid: MiddlewareFn<MyContext> = async ({ context: { req }, args: { sessionToken } }, next) => {
	const token = req.headers["authorization"]?.split("_")?.[1];
	if (!token) return null

	if (!sessionToken) return null

	const node = await Node.findOne({ where: { token } })
	if (!node) return null

	const conn = await getOrCreateNodeClient({ node, ping: false })
	if (!conn || conn.sessionToken !== sessionToken) return null

	next()
}