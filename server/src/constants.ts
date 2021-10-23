import fsPath from "path";

export const TMP_FOLDER = fsPath.join(__dirname, "../../tmp");

// 7 days
export const MAX_AGE_REFRESH_TOKEN: number = 1000 * 60 * 60 * 24 * 7;
// 15 min
export const MAX_AGE_ACCESS_TOKEN: number = 1000 * 60 * 15;

export const IMGS_FOLDER = fsPath.join(__dirname, "../images")

export const dfOptions = { prefixMultiplier: "MiB", isDisplayPrefixMultiplier: false };
