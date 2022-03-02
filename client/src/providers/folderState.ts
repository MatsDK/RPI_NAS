import { TreeItem } from "generated/apolloComponents";
import { MoveDataMutation } from "graphql/Folder/moveData";
import { getTreeQuery } from "graphql/TreeObject/queryTree";
import React from "react";

export type FolderContextType = FolderContext | null;

export type CurrentFolderType = {
	path: string | null;
	datastoreId: number | null;
	datastoreName: string | null;
};

type Selected = Map<string, TreeItem>
type DestProps = { datastoreId: number, path: string, currentPath: string }

interface FolderContext {
	currentFolderPath?: {
		folderPath: CurrentFolderType;
		setFolderPath: React.Dispatch<React.SetStateAction<CurrentFolderType>>;
	};
	newFolderInput?: {
		showNewFolderInput: boolean;
		setShowNewFolderInput: React.Dispatch<React.SetStateAction<boolean>>;
	};
	selected: {
		selectedItems: Selected;
		setSelected: React.Dispatch<React.SetStateAction<Selected>>;
	};
	moveSelected: (folderCtx: Selected, dest: DestProps, mutate: any) => Promise<void>
}

export const moveSelected = async (selected: Selected, { datastoreId, path, currentPath }: DestProps, mutate: any) => {
	const selectedData = Array.from(
		selected
	).map(([_, v]) => ({
		path: v.relativePath,
		type: v.isDirectory ? "directory" : "file",
	}));

	const variables = {
		data: selectedData,
		datastoreId,
		destination: { path, datastoreId },
	}

	try {
		const res = await mutate(
			MoveDataMutation,
			variables,
			{
				refetchQueries: [
					{
						query: getTreeQuery,
						variables: {
							depth: 1,
							datastoreId: datastoreId,
							path,
						},
					},
					{
						query: getTreeQuery,
						variables: {
							depth: 1,
							datastoreId,
							path: currentPath,
						},
					},
				],
			}
		)

		console.log(res)
	} catch (err) {
		console.log(err)
	}

}

export const FolderContext = React.createContext<FolderContextType>(null);
