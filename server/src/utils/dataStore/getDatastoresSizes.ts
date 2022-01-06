import { gql } from "apollo-server-core";
import { dfOptions } from "../../constants";
import { Datastore, SizeObject } from "../../entity/Datastore";
import { getOrCreateNodeClient } from "../nodes/nodeClients";
import { Node } from "../../entity/CloudNode"
const df = require("df")

const getLocalDatastoreSizes = (datastores: Datastore[]): Promise<Datastore[]> => new Promise((res, rej) => {
	df(dfOptions, (err: any, r: any) => {
		if (err) rej(err);

		for (const ds of datastores) {
			const fs = r.find((f: any) => f.mount === ds.basePath);

			if (fs) {
				const sizeObj = new SizeObject();

				sizeObj.usedSize = Math.round(fs.used * 10) / 10;
				sizeObj.usedPercent = Math.round(fs.capacity * 100);

				ds.size = sizeObj;
			}
		}

		res(datastores);
	});
})

const GET_REMOTE_DATASTORE_SIZES_QUERY = gql`
query GetDatastoreSizes($datastores: [GetDatastoreSizesInput!]!) {
  getDatastoresSizes(datastores: $datastores) {
    id
    path
    size {
      usedSize
      usedPercent
    }
  }
}
`

type GetDatastoreSizesReturnObj = { id: number, path: string, size: SizeObject }

const getRemoteDatastoreSizes = async (datastores: Datastore[], node: Node): Promise<Datastore[]> => {
	try {
		const client = await getOrCreateNodeClient({ node, ping: false })
		if (!client) return []

		const { data } = await client.conn.query({
			query: GET_REMOTE_DATASTORE_SIZES_QUERY,
			variables: { datastores: datastores.map(({ id, basePath }) => ({ id, path: basePath })) }
		})

		return datastores.map((ds) => ({
			...ds,
			size: (data.getDatastoresSizes as GetDatastoreSizesReturnObj[]).find(({ id }) => id === ds.id)?.size
		}) as Datastore)
	} catch (e) {
		console.log(e)
		return []
	}
}

export const getDatastoreSizes = async (datastores: Datastore[], nodes: Node[]): Promise<Datastore[]> => {
	let ret: Datastore[] = []

	for (const node of nodes) {
		const nodeDatastores = datastores.filter(({ localNodeId }) => node.id === localNodeId)

		ret = [
			...ret,
			...(node.hostNode ? await getLocalDatastoreSizes(nodeDatastores) : await getRemoteDatastoreSizes(nodeDatastores, node))
		]
	}

	return ret
}
