import { Request, Response } from "express";

export type Type = "file" | "directory";

export interface MyContext {
  req: Request & { userId: number; user: any };
  res: Response;
}
