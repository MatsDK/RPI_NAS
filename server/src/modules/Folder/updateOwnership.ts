import { Datastore } from "../../entity/Datastore"
import { hasAccessToDatastore } from "../../utils/dataStore/hasAccessToDatastore"
import { getOrCreateNodeClient } from "../../utils/nodes/nodeClients"
import { UpdateOwnershipMutation } from "./UpdateOwnershipMutation"
import { Node } from "../../entity/CloudNode"
import fsPath from "path";
import { exec } from "../../utils/exec"
import { ApolloError } from "apollo-server-errors"

interface Props {
	node?: Node
	datastore?: Datastore
}

export const updateOwnership = async (datastoreId: number, userId: number, props?: Props) => {
	let datastore = props?.datastore, node = props?.node

	if (!datastore) {
		datastore = await Datastore.findOne({ where: { id: datastoreId } })
		if (!datastore) return null
	}

	if (!(await hasAccessToDatastore(datastoreId, userId, datastore.userId))) return null

	if (!node) {
		node = await Node.findOne({ where: { id: datastore.localNodeId } })
		if (!node) return null
	}

	if (node.hostNode) {
		const { stderr } =
			await exec(`chown ${node.loginName}:${fsPath.basename(datastore.basePath)} ${datastore.basePath}/* -R`)

		if (stderr) {
			console.log(stderr)
			throw new ApolloError(stderr)
		}
	} else {
		const client = await getOrCreateNodeClient({ node, ping: false })

		try {
			const res = await client?.conn.mutate({
				mutation: UpdateOwnershipMutation,
				variables: {
					loginName: node.loginName,
					datastoreName: fsPath.basename(datastore.basePath),
					path: datastore.basePath
				}
			})

			console.log(res)
		} catch (e) {
			console.log(e)
			throw new ApolloError(e as any)
		}
	}

	return true
}