import { useGetFriendsAndFriendRequestsQueryQuery } from 'generated/apolloComponents';
import { acceptFriendRequestMutation } from 'graphql/Friends/acceptFriendRequest';
import { GetFriendsAndFriendRequestsQuery } from 'graphql/Friends/getFriends';
import { removeFriendMutation } from 'graphql/Friends/removeFriend';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useApollo } from 'src/hooks/useApollo';
import Icon from 'src/ui/Icon';
import { ProfilePicture } from 'src/ui/ProfilePicture';
import { Scrollbar } from 'src/ui/Scrollbar';
import styled from 'styled-components';
import SideBar from '../SideBar';
import { FindFriendsContainer } from './FindFriendsContainer';

const Container = styled.div`
	${Scrollbar}
	padding: 25px 0 0 30px;
	height: 100%;
	overflow: auto;
	min-width: 300px;
	padding-bottom: 100px;

	> div:not(:last-child) {
		border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
	}
`;

export const Title = styled.h2`
	font-size: 25px;
	font-weight: 600;
	color: ${(props) => props.theme.textColors[0]};

	span {
		color: ${(props) => props.theme.textColors[2]};
		margin-left: 3px;
		font-weight: 400;
		font-size: 14px;
	}
`;

const ContainerItem = styled.div`
	padding: 10px 0;
`;

export const PlaceHolder = styled.span`
	color: ${(props) => props.theme.textColors[2]};
`;

const FriendRequest = styled.div`
	padding: 3px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	:hover button {
		opacity: 1;
	}

	> div {
		align-items: center;
		display: flex;

		span {
			margin-left: 10px;
			font-size: 18px;
			font-weight: 4000;
			color: ${(props) => props.theme.textColors[1]};
		}
	}
`;

const Friend = styled.div`
	padding: 3px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	> div {

		display: flex;
		align-items: center;

		span  {
			margin-left: 10px;
			font-size: 18px;
			color: ${(props) => props.theme.textColors[1]};
		}
	}

	> button {
		background-color: transparent;
		border: 0;
		cursor: pointer;
		opacity: 0;
		transition: .1s ease-in-out;
	}

	:hover > button {
		opacity: 1;
	}
`;

const AcceptButton = styled.button`
	background-color: transparent;
	border: 0;
	outline: none;
	cursor: pointer;
	color: ${(props) => props.theme.textColors[2]};
	transition: 0.15s ease-in-out;
	opacity: 0;

	:hover {
		color: ${(props) => props.theme.textColors[1]};
	}
`;

interface FriendsViewProps {

}

export const FriendsView: React.FC<FriendsViewProps> = ({ }) => {
	const client: any = useApolloClient();
	const { mutate } = useApollo()
	const { data, loading, error } = useGetFriendsAndFriendRequestsQueryQuery({
		client,
	});

	if (loading) return <div>loading</div>;

	if (error) {
		console.log(error);
		return null;
	}

	const friends = data?.friends?.friends,
		friendRequests = data?.friends?.friendsRequest;

	const acceptFriendRequest = async (userId: number) => {
		const { errors, data } = await mutate(
			acceptFriendRequestMutation,
			{ userId },
			{ refetchQueries: [{ query: GetFriendsAndFriendRequestsQuery, variables: {} }] },
		);

		console.log(errors, data);
	};

	const removeFriend = async (userId: number) => {
		try {
			const res = await mutate(
				removeFriendMutation,
				{ userId },
				{ refetchQueries: [{ query: GetFriendsAndFriendRequestsQuery, variables: {} }] },
			)

			console.log(res)
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<SideBar />
			<Container>
				<ContainerItem>
					<Title>
						Friend Requests
						{friendRequests && friendRequests.length >= 1 ? (
							<span>
								{friendRequests.length} Friend Request
								{friendRequests.length != 1 ? "s" : ""}
							</span>
						) : null}
					</Title>
					{friendRequests?.length ? (
						friendRequests?.map((f, idx) => (
							<FriendRequest key={idx} style={{ display: "flex" }}>
								<div>
									<ProfilePicture
										src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${f.id}`}
									/>
									<span>{f.userName}</span>
								</div>
								<AcceptButton onClick={() => acceptFriendRequest(Number(f.id))}>
									Accept
								</AcceptButton>
							</FriendRequest>
						))
					) : (
						<PlaceHolder>No friend requests</PlaceHolder>
					)}
				</ContainerItem>
				<ContainerItem>
					<Title>
						Friends
						{friends && friends.length >= 1 ? (
							<span>
								{friends.length} Friend{friends.length != 1 ? "s" : ""}
							</span>
						) : null}
					</Title>
					{friends?.length ? (
						friends?.map((f, idx) => (
							<Friend key={idx}>
								<div>
									<ProfilePicture
										src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${f.id}`}
									/>
									<span>{f.userName}</span>
								</div>
								<button onClick={() => removeFriend(+f.id)}>
									<Icon
										name="removeIcon"
										color={{ idx: 1, propName: "textColors" }}
										height={20}
										width={20}
										viewPort={22}
									/>
								</button>
							</Friend>
						))
					) : (
						<PlaceHolder>No friends</PlaceHolder>
					)}
				</ContainerItem>
			</Container>
			<FindFriendsContainer
				friendsIds={data?.friends?.friends.map(({ id }) => Number(id)) || []}
				friendRequestsIds={
					data?.friends?.friendsRequest.map(({ id }) => Number(id)) || []
				}
				acceptFriendRequest={acceptFriendRequest}
			/>
		</>
	);
}