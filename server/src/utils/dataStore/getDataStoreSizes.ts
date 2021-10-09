const df = require("node-df")
import {Datastore} from "../../entity/Datastore"

export const getDataStoreSizes = (dataStores: Datastore[]): Promise<Datastore[]> => {

	return new Promise((res, rej) => {

		df((err: any, r: any) => {
			if(err) rej(err)

			for (const ds of dataStores) {
				const fs = r.find((f: any) => f.mount === ds.basePath)
			//	console.log(fs, ds.basePath)
			}
		
			res(dataStores)
		})

	}) }
