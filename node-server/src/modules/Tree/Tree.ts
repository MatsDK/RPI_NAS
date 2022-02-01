import { Field, ObjectType } from "type-graphql";
import { getTreeObject } from "./getTreeObject";
import { TreeItem } from "./TreeItem";

@ObjectType()
export class Tree {
	@Field(() => [TreeItem], { nullable: true })
	tree: TreeItem[] | null;

	async init(path: string, basePath: string, depth: number, directoryTree: boolean) {
		this.tree = getTreeObject(path, basePath, depth, directoryTree)

		return this
	}
}