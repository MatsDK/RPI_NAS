import { Request, Response } from "express";
import { Node } from "../entity/CloudNode";
import { Datastore } from "../entity/Datastore";
import { User } from "../entity/User";

export type Type = "file" | "directory";

interface ReqProps {
	userId: number;
	user: User | undefined,
	dataStore?: Datastore,
	localNode?: Node
}

export interface MyContext {
	req: Request & ReqProps;
	res: Response;
}
