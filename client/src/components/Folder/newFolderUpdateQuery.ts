import { MutationUpdaterFn } from "apollo-boost";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import fsPath from "path"


export const update = (newPath: string, path: string, datastoreId: number): MutationUpdaterFn<any> => (cache, { data }) => {
	try {
		const cacheData: any = cache.readQuery({
			query: getTreeQuery,
			variables: { depth: 1, path, datastoreId },
		});

		if (!data.createFolder || !cacheData?.tree) return;

		const newItem = {
			relativePath: newPath,
			isDirectory: true,
			path: data.createFolder,
			name: fsPath.basename(newPath),
			__typename: "TreeItem",
		};

		cacheData.tree.tree = [newItem, ...cacheData.tree.tree];

		cache.writeQuery({
			query: getTreeQuery,
			variables: { depth: 1, path, datastoreId },
			data: cacheData,
		});
	} catch (error) {
		console.log(error);
	}
}
