import { TreeItem } from "./TreeItem";
import fs from "fs";
import fsPath from "path";

export const getTreeObject = (path: string, basePath: string, depth: number, directoryTree: boolean): null | TreeItem[] => {
	if (!depth) return null

	try {
		const thisPathstats = fs.lstatSync(path);
		if (!thisPathstats.isDirectory()) return null;
	} catch (err) {
		console.log(err)
		return null
	}

	const entries: TreeItem[] = []

	let directoryEntries: string[] = []
	try {
		directoryEntries = fs.readdirSync(path)
	} catch (err) {
		console.log(err)
		return null
	}

	for (const directoryEntry of directoryEntries) {
		try {
			const thisPath = fsPath.join(path, directoryEntry),
				stats = fs.lstatSync(thisPath);

			if (directoryTree && !stats.isDirectory()) continue;

			const newEntry = new TreeItem(
				thisPath,
				basePath,
				stats.isDirectory() ? depth - 1 : 0,
				directoryTree,
			);

			newEntry.name = directoryEntry;
			newEntry.size = stats.size;
			newEntry.relativePath = fsPath.relative(basePath, thisPath);
			newEntry.isDirectory = stats.isDirectory();

			entries.push(newEntry);
		} catch (err) {
			console.log(err)
		}

	}

	return entries
}