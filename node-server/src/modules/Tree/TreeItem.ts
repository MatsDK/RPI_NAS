import { Field, ObjectType } from "type-graphql";
import fsPath from "path";
import { getTreeObject } from "./getTreeObject";

@ObjectType()
export class TreeItem {
	@Field()
	name: string;

	@Field()
	path: string;

	@Field()
	relativePath: string;

	@Field()
	isDirectory: boolean;

	@Field({ nullable: true })
	size: number;

	@Field(() => [TreeItem], { nullable: true })
	tree: TreeItem[] | null;

	constructor(path: string, basePath: string, depth: number, directoryTree: boolean) {
		this.tree = getTreeObject(path, basePath, depth, directoryTree);
		this.path = path
	}
}