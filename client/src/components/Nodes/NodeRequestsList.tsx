import React, { useState } from 'react'
import { AcceptNodeRequestForm } from './AcceptNodeRequestForm';
import { ConditionButton } from "../../ui/Button"
import { Node } from 'generated/apolloComponents';
import { useApollo } from 'src/hooks/useApollo';
import { DeleteNodeRequestMutation } from 'graphql/Node/deleteNodeRequest';
import { getNodesQuery } from 'graphql/Node/getNodes';

interface NodeRequestsListProps {
	host: Node | undefined
	nodeRequests: any[]
}

export const NodeRequestsList: React.FC<NodeRequestsListProps> = ({ host, nodeRequests }) => {
	const [acceptNodeId, setAcceptNodeId] = useState<null | number>(null);
	const { mutate } = useApollo()

	const deleteNodeRequest = async (id: number) => {
		const res = await mutate(DeleteNodeRequestMutation, { id }, { refetchQueries: [{ query: getNodesQuery, variables: {} }] })
		console.log(res)
	}

	return (
		<div>
			{nodeRequests.map(({ ip, id, port }, idx) => {
				const showAcceptForm = id === acceptNodeId

				return (
					<div key={idx} >
						<div style={{ display: "flex" }}>
							{ip}:{port}
							<ConditionButton condition={!!host}>
								<button onClick={() => setAcceptNodeId(() => showAcceptForm ? null : id)}>Accept</button>
							</ConditionButton>
							<ConditionButton condition={!!host}>
								<button onClick={() => deleteNodeRequest(id)}>Delete</button>
							</ConditionButton>
						</div>

						{showAcceptForm &&
							<AcceptNodeRequestForm id={id} hostLoginName={host!.loginName} />
						}
					</div>
				)
			})}
		</div>
	);
}