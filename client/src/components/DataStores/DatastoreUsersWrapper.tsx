import { Datastore } from 'generated/apolloComponents';
import React from 'react';
import { useMeState } from 'src/hooks/useMeState';
import { ProfilePicture } from 'src/ui/ProfilePicture';
import styled from 'styled-components';
import { UserWrapper, UserWrapperLeft } from './DatastoreContainer';
import { DatastoreUsers } from './DatastoreUsers';

interface DatastoreUsersWrapperProps {
	datastore: Datastore
	updatedDatastore: Datastore | null
	setUpdatedDatastore: React.Dispatch<React.SetStateAction<Datastore | null>>
	smbEnabled: boolean
	setSmbEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

const SmallTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColors[0]};
`;

const Headers = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
  margin: 10px 0;

  h3 {
    min-width: 60%;
  }

  span {
    color: ${(props) => props.theme.textColors[1]};
    font-size: 16px;
  }
`;

export const DatastoreUsersWrapper: React.FC<DatastoreUsersWrapperProps> = ({
	datastore,
	updatedDatastore,
	setUpdatedDatastore,
	smbEnabled,
	setSmbEnabled
}) => {
	const { me } = useMeState()
	const isDatastoreOwner = me?.id === datastore.owner?.id

	return (
		<div>
			<Headers>
				<SmallTitle>Users</SmallTitle>
				<span>SMB enabled</span>
			</Headers>
			<div>
				{!isDatastoreOwner && datastore.sharedUsers.find(({ id }) => me?.id == id) && (
					<UserWrapper>
						<UserWrapperLeft>
							<div></div>
							<ProfilePicture
								src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${me?.id}`}
							/>
							<p>
								{me?.userName}
								<span>(You)</span>
							</p>
						</UserWrapperLeft>
						{updatedDatastore?.allowedSMBUsers?.includes(Number(me?.id)) && (
							<>
								<input
									type="checkbox"
									checked={smbEnabled}
									onChange={(e) => setSmbEnabled(e.target.checked)}
								/>
							</>
						)}
					</UserWrapper>
				)}
				<UserWrapper>
					<UserWrapperLeft>
						<div></div>
						<ProfilePicture
							src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${datastore.owner?.id}`}
						/>
						<p>
							{datastore.owner?.userName}
							<span>
								(Owner)
								{me?.id == datastore.owner?.id && "(You)"}
							</span>
						</p>
					</UserWrapperLeft>
					{isDatastoreOwner && (
						<input
							type="checkbox"
							onChange={() =>
								setUpdatedDatastore((uds) => {
									const newObj = { ...uds, owner: { ...uds?.owner } };
									newObj?.owner?.smbEnabled != null &&
										(newObj.owner.smbEnabled = !newObj?.owner?.smbEnabled);

									return { ...newObj } as any;
								})
							}
							checked={!!updatedDatastore?.owner?.smbEnabled}
						/>
					)}
				</UserWrapper>
			</div>
			<DatastoreUsers
				setUpdatedDatastore={setUpdatedDatastore}
				updatedDatastore={updatedDatastore}
				isDatastoreOwner={isDatastoreOwner}
			/>
		</div>
	);
}