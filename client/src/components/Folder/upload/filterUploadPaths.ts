import { SelectedPath, SelectedPaths } from "./UploadWrapper";

export const filterPaths = (selected: SelectedPaths): SelectedPath[] => {
	const data = Array.from(selected),
		newData: Array<{ path: string; isDir: boolean, name }> = [];

	if (!data.length) return [];

	for (const path of data) {
		let addValue = true;

		data.forEach((p) => {
			if (path.includes(p[0]) && path !== p) addValue = false;
		});

		if (addValue) newData.push({ path: path[0], isDir: path[1].isDir, name: path[1].name });
	}

	return newData
}