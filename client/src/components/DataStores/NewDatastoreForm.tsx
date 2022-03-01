import { useGetFriendsQueryQuery, useGetNodesQueryQuery } from 'generated/apolloComponents';
import Link from "next/link"
import React, { useState } from 'react';
import { ConditionOverlay } from '../ConditionOverlay';
import { useApolloClient } from 'react-apollo';
import { useInput } from 'src/hooks/useInput';
import { useMeState } from 'src/hooks/useMeState';
import { ProfilePicture } from "src/ui/ProfilePicture";
import { Select } from 'src/ui/Select';
import styled from 'styled-components';
import { Input, Label as InputLabel } from "../../ui/Input";
import { BgButton, Button, ConditionButton, LoadingOverlay } from "../../ui/Button"
import { useApollo } from 'src/hooks/useApollo';
import { CreateDataStoreMutation } from 'graphql/DataStores/CreateDataStore';
import { getDataStoresQuery } from 'graphql/DataStores/getDataStores';

interface NewDatastoreFormProps {
	hide: () => void
}

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
	pointer-events: all;
	display: flex;
	flex-direction: column;
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

const Bottom = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 40px;
`

const OverlayText = styled.div`
	color: ${props => props.theme.textColors[1]};
	font-size: 18px;

	> a {
		color: ${props => props.theme.textColors[0]};
		font-size: 18px;
		font-weight: 600;
	}
`

const Overlay = styled.div`
	display: flex;
	flex-direction: column;
`

interface OverlayElementProps {
	hide: () => void
}

const OverlayElement: React.FC<OverlayElementProps> = ({ hide }) => {
	return (
		<Overlay>
			<OverlayText>Initialize a <Link href={"/nodes/createhost"}>host node</Link> before creating a datastore</OverlayText>
			<Button onClick={hide}>Cancel</Button>
		</Overlay>
	)
}

export const NewDatastoreForm: React.FC<NewDatastoreFormProps> = ({ hide }) => {
	const { me } = useMeState()
	const [name, setName] = useState("")
	const [selectedOwner, setSelectedOwner] = useState<number | null>(null)
	const [selectedNode, setSelectedNode] = useState<number | null>(null)

	const [sizeInput, setSizeInput] = useInput<string | null>(null)
	const [passwordInput, setPasswordInput] = useInput<string>("")

	const [loading, setLoading] = useState<boolean>(false)
	const client: any = useApolloClient();
	const { mutate } = useApollo()

	const { data: friends, error: friendsError } = useGetFriendsQueryQuery({
		client,
	});

	const { data: nodes, error: NodesError, loading: nodesLoading } = useGetNodesQueryQuery({
		client,
	});

	if (friendsError || NodesError) {
		console.log(friendsError, NodesError)
		return null
	}

	const passwordRequired = me && selectedNode != null && selectedOwner != null &&
		!nodes?.getNodes?.nodes.find(({ id }) => +selectedNode == +id)?.initializedUsers.includes(+me.id) &&
		+me.id == +selectedOwner

	const createDatastore = async () => {
		if (!name.trim() || selectedNode == null || selectedOwner == null || !isValidSize(sizeInput || "")) return null

		setLoading(true)
		const { data } = await mutate(
			CreateDataStoreMutation,
			{
				ownerId: Number(selectedOwner),
				localNodeId: Number(selectedNode),
				name: name.trim(),
				sizeInMb: isValidSize(sizeInput!),
				ownerPassword: passwordInput?.trim()
			},
			{ refetchQueries: [{ query: getDataStoresQuery, variables: {} }] },
		);
		setLoading(false)

		console.log(data);
	}

	return (
		<Wrapper>
			<Container>
				<ConditionOverlay
					condition={!nodesLoading && !nodes?.getNodes?.nodes.find(({ hostNode }) => hostNode)}
					renderOverlay={() => <OverlayElement hide={hide} />}
				>
					<div style={{ "display": "flex", "flexDirection": "column", height: "100%", padding: "10px 20px" }}>
						<Title>
							New datastore
							<span>Configure a new datastore</span>
						</Title>
						<div style={{ flex: 1 }}>
							<Section>
								<Label>Name</Label>
								<Input placeholder="Name" value={name} onChange={(e) => setName(e.currentTarget.value.replace(/[^a-z0-9]/gi, "_"))} />
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

								<Label>Datastore owner</Label>
								<div style={{ display: "flex", flexDirection: "column" }}>

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
									{passwordRequired &&
										<>
											<InputLabel>Your password</InputLabel>
											<Input placeholder="password" type="password" value={passwordInput} onChange={setPasswordInput} />
										</>
									}
								</div>
							</Section>
							<Section>
								<Label>Size</Label>
								<Input placeholder="Size" value={sizeInput || ""} onChange={setSizeInput} />
							</Section>
						</div>
						<Bottom>
							<ConditionButton condition={!loading} >
								<Button onClick={hide} >Cancel</Button>
							</ConditionButton>
							<ConditionButton condition={!loading && !!isValidSize(sizeInput || "") && selectedOwner != null && selectedNode != null && !!name.trim()
								&& !(passwordRequired && passwordInput.trim())}>
								<LoadingOverlay loading={loading}>
									<BgButton onClick={createDatastore}>Create datastore</BgButton>
								</LoadingOverlay>
							</ConditionButton>
						</Bottom>
					</div>
				</ConditionOverlay>
			</Container>
		</Wrapper >

	);
}

const isValidSize = (sizeInput: string): null | number => {
	const lastChar = sizeInput
		.toLowerCase()
		.trim()
		.charAt(sizeInput.trim().length - 1);

	let m = 1;
	if (lastChar == "g") m = 1024;
	else if (lastChar != "m") return null;

	const lastIdx = sizeInput.toLowerCase().indexOf(lastChar),
		num = Number(sizeInput.slice(0, lastIdx)) * m;

	return (!!num && num >= 1 && num <= 200000) ? num : null
}