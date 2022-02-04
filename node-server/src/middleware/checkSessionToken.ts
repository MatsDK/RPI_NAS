import { MiddlewareFn } from "type-graphql";
import { MyContext } from "..";
import { getOrCreateConnection } from "../utils/nodes/client";

export const checkSessionToken: MiddlewareFn<MyContext> = async ({ context: { req } }, next) => {
	if (req.headers["authorization"] !== getOrCreateConnection().sessionToken) return null

	return next()
}