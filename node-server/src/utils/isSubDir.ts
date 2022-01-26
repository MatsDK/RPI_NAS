import fsPath from "path";

export const isSubDir = (srcPath: string, destPath: string): boolean => {
	const relative = fsPath.relative(srcPath, destPath);
	return !!relative && !relative.startsWith('..') && !fsPath.isAbsolute(relative);
}