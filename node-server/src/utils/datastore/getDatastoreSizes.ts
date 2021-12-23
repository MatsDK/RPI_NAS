import { GetDatastoreSizesInput, SizeObject } from "../../modules/GetDatastoreSizes";
import { dfOptions } from "../../constants";
const df = require("node-df");

export const getDatastoreSizes = (datastores: GetDatastoreSizesInput[]) => {
	return new Promise((res, rej) => {
		df(dfOptions, (err: any, r: any) => {
			if (err) rej(err);

			for (const ds of datastores) {
				const fs = r.find((f: any) => f.mount === ds.path);

				if (fs) {
					const sizeObj = new SizeObject();

					sizeObj.usedSize = Math.round(fs.used * 10) / 10;
					sizeObj.usedPercent = Math.round(fs.capacity * 100);

					ds.size = sizeObj;
				}
			}

			res(datastores)
		})
	})
}