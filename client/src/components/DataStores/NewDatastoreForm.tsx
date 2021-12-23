import { useGetFriendsQueryQuery, useGetNodesQueryQuery } from 'generated/apolloComponents';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { useMeState } from 'src/hooks/useMeState';
import { ProfilePicture } from "src/ui/ProfilePicture";
import { Select } from 'src/ui/Select';
import styled from 'styled-components';
import { Input } from "../../ui/Input";

interface NewDatastoreFormProps { }

const Wrapper = styled.div`
	position: absolute;
	width: 100vw;
	height: 100vh;
	display: grid;
	place-items: center;
	top: 0;
	pointer-events: none;
	left: 0;
`

const Container = styled.div`
	min-width: 600px;
	background-color: ${props => props.theme.lightBgColors[0]};
	border: 1px solid ${props => props.theme.lightBgColors[1]};
	border-radius: 5px;
	width: 40vw;
	max-width: 900px;
	z-index: 100;
	height: 60vh;
	max-height: 500px;
	min-height: 400px;
	box-shadow:  0 0 30px 5px #00000012;
	padding: 10px 20px;
	pointer-events: all;
`

const Title = styled.h1`
	color: ${props => props.theme.textColors[0]};
	font-size: 25px;
	font-weight: 600;
	display: flex;
	flex-direction: column;

	> span {
		color: ${props => props.theme.textColors[1]};
		font-size: 16px;
		margin-top: -5px;
		font-weight: normal;
	}

	margin-bottom: 20px;
`

const Label = styled.span`
	color: ${props => props.theme.textColors[1]};
	font-size: 18px;
	width: 50%;
`

const Section = styled.div`
	width: 100%;
	display: flex;
	padding: 10px 0;
	min-height: 60px;
	border-bottom: 1px solid ${props => props.theme.lightBgColors[1]};
`

const SelectCloudDropdownItem = styled.div`
	cursor: pointer;
	padding: 5px 0 5px 15px;
	background-color: ${props => props.theme.lightBgColors[0]};

	p {
		font-size: 14px;
		color: ${(props) => props.theme.textColors[2]};
	}

	:hover {
		background-color: ${props => props.theme.lightBgColors[1]};
	}
`;

const SelectOwnerItem = styled.div`
	display: flex;
	padding: 5px 0 5px 15px;
	width: 100%;
	align-items: center;
	cursor: pointer;
	background-color: ${props => props.theme.lightBgColors[0]};

	> img {
		margin-right: 5px;
	}

	> span {
		color: ${(props) => props.theme.textColors[1]};
	}

	:hover {
		background-color: ${props => props.theme.lightBgColors[1]};
	}
`;


export const NewDatastoreForm: React.FC<NewDatastoreFormProps> = ({ }) => {
	const { me } = useMeState()
	const [name, setName] = useState("")
	const [selectedOwner, setSelectedOwner] = useState<number | null>(null)
	const [selectedNode, setSelectedNode] = useState<number | null>(null)
	const client: any = useApolloClient();

	const { data: friends, error: friendsError } = useGetFriendsQueryQuery({
		client,
	});

	const { data: nodes, error: NodesError } = useGetNodesQueryQuery({
		client,
	});

	if (friendsError || NodesError) {
		console.log(friendsError, NodesError)
		return null
	}

	return (
		<Wrapper>
			<Container >
				<Title>
					New datastore
					<span>Configure a new datastore</span>
				</Title>
				<Section>
					<Label>Name</Label>
					<Input placeholder="Name" value={name} onChange={(e) => setName(e.currentTarget.value.replace(/[^a-z0-9]/gi, "_"))} />
				</Section>
				<Section>
					<Label>Datastore owner</Label>
					<Select data={[me, ...(friends?.getFriends || [])]} label="Datastore owner" setValue={(owner) => setSelectedOwner(owner.id)} renderItem={
						(item, idx, setSelected) => (<SelectOwnerItem
							key={idx}
							onClick={setSelected}
						>
							<ProfilePicture
								src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${item.id}`}
							/>
							<span>{item.userName}</span>
						</SelectOwnerItem>)
					} uniqueKey="id" selectedLabelKey="userName" />
				</Section>
				<Section>
					<Label>Datastore host</Label>
					<Select data={nodes?.getNodes?.nodes || []} label="Datastore host" setValue={(node) => setSelectedNode(node.id)} renderItem={
						(item, idx, setSelected) => (
							<SelectCloudDropdownItem
								key={idx}
								onClick={setSelected}
							>
								{item.name}
								<p>{item.ip}</p>
							</SelectCloudDropdownItem>
						)
					} uniqueKey="id" selectedLabelKey="name" />
				</Section>
				<Section>
					<Label>Size</Label>
					<Input placeholder="Size" />
				</Section>
			</Container>
		</Wrapper>

	);
}