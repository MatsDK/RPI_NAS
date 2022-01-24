import { Field, ObjectType } from "type-graphql";
import { TreeItem } from "./TreeItem";
import { getTreeObject } from "./getTreeObject";

@ObjectType()
export class Tree {
	@Field(() => [TreeItem], { nullable: true })
	tree: TreeItem[] | null;

	async init(path: string, basePath: string, depth: number, directoryTree: boolean) {
		this.tree = getTreeObject(path, basePath, depth, directoryTree)

		return this
	}
}