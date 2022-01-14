import React from 'react'
import { AcceptNodeRequestForm } from './AcceptNodeRequestForm';
import { Button, BgButton, ConditionButton } from "../../ui/Button"
import { Node, NodeRequest } from 'generated/apolloComponents';
import { useApollo } from 'src/hooks/useApollo';
import { DeleteNodeRequestMutation } from 'graphql/Node/deleteNodeRequest';
import { getNodesQuery } from 'graphql/Node/getNodes';
import styled from 'styled-components';

interface NodeRequestsListItemProps {
	selectedNodeRequest: number | null
	setSelectedNodeRequest: React.Dispatch<React.SetStateAction<number | null>>
	request: NodeRequest,
	host: Node
}

const NodeRequestListItemWrapper = styled.div`
	padding: 15px;
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
`

const NodeRequestInfo = styled.div`
	display: flex;
	justify-content: space-between;

	> div {
		display: flex;

		> span {
			display: flex;
			font-size: 17px;
			color: ${props => props.theme.textColors[0]};
			font-weight: 600;
			
			:first-child {
				margin-right: 15px;
			}

			> p {
				margin-right: 4px;
				font-weight: normal;
				color: ${props => props.theme.textColors[1]};
			}
		}
	}
`

export const NodeRequestsListItem: React.FC<NodeRequestsListItemProps> = ({ host, request, selectedNodeRequest, setSelectedNodeRequest }) => {
	const { mutate } = useApollo()

	const deleteNodeRequest = async (id: number) => {
		const res = await mutate(DeleteNodeRequestMutation, { id }, { refetchQueries: [{ query: getNodesQuery, variables: {} }] })
		console.log(res)
	}

	const showAcceptForm = selectedNodeRequest === request.id

	return (
		<NodeRequestListItemWrapper>
			<NodeRequestInfo>
				<div>
					<span>
						<p>Node ip: </p>
						{request.ip}
					</span>
					<span>
						<p>Port: </p>
						{request.port}
					</span>
				</div>
				<div>
					<ConditionButton condition={!!host}>
						<Button onClick={() => deleteNodeRequest(request.id)}>Delete</Button>
					</ConditionButton>
					<ConditionButton condition={!!host}>
						<BgButton onClick={() => setSelectedNodeRequest(() => showAcceptForm ? null : request.id)}>Accept</BgButton>
					</ConditionButton>
				</div>
			</NodeRequestInfo>
			{showAcceptForm &&
				<AcceptNodeRequestForm id={request.id} hostLoginName={host!.loginName} />
			}
		</NodeRequestListItemWrapper>
	)
}