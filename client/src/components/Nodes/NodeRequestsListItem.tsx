import React from 'react'
import { AcceptNodeRequestForm } from './AcceptNodeRequestForm';
import { ConditionButton } from "../../ui/Button"
import { Node, NodeRequest } from 'generated/apolloComponents';
import { useApollo } from 'src/hooks/useApollo';
import { DeleteNodeRequestMutation } from 'graphql/Node/deleteNodeRequest';
import { getNodesQuery } from 'graphql/Node/getNodes';

interface NodeRequestsListItemProps {
	selectedNodeRequest: number | null
	setSelectedNodeRequest: React.Dispatch<React.SetStateAction<number | null>>
	request: NodeRequest,
	host: Node
}

export const NodeRequestsListItem: React.FC<NodeRequestsListItemProps> = ({ host, request, selectedNodeRequest, setSelectedNodeRequest }) => {
	const { mutate } = useApollo()

	const deleteNodeRequest = async (id: number) => {
		const res = await mutate(DeleteNodeRequestMutation, { id }, { refetchQueries: [{ query: getNodesQuery, variables: {} }] })
		console.log(res)
	}

	const showAcceptForm = selectedNodeRequest === request.id

	return (
		<div>
			<div style={{ display: "flex" }}>
				{request.ip}:{request.port}
				<ConditionButton condition={!!host}>
					<button onClick={() => setSelectedNodeRequest(() => showAcceptForm ? null : request.id)}>Accept</button>
				</ConditionButton>
				<ConditionButton condition={!!host}>
					<button onClick={() => deleteNodeRequest(request.id)}>Delete</button>
				</ConditionButton>
			</div>
			{showAcceptForm &&
				<AcceptNodeRequestForm id={request.id} hostLoginName={host!.loginName} />
			}
		</div>
	)
}