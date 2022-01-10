import { Request, Response } from "express";
import { User } from "../entity/User";

export type Type = "file" | "directory";

export interface MyContext {
  req: Request & { userId: number; user: User | undefined };
  res: Response;
}
