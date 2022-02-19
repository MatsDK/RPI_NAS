import { Datastore } from 'generated/apolloComponents';
import Icon from 'src/ui/Icon';
import React from 'react'
import styled from 'styled-components';
import { copy } from 'src/utils/copyToClipboard';

interface DatastoreInfoProps {
	datastore: Datastore
}

const Wrapper = styled.div`
	> div {
		margin: 20px 0;
		display: flex;


		> div:not(:first-child) {
			margin-left:20px;
		}
	}
`

type StatusProps = { status: string }

const Status = styled.div<StatusProps>`
	color: ${props => props.theme.textColors[1]};
	font-size: 16px;
	display: flex;
	 
	> p {
		font-weight: 600;
		margin-left: 3px;
		color: ${props => props.theme.statusColors[["init", "online", "offline"].indexOf(props.status)]};
	}
`

const Size = styled.div`
	color: ${props => props.theme.textColors[1]};
	font-size: 16px;
	display: flex;

	> p {
		margin-left: 3px;
		color: ${props => props.theme.textColors[0]};
	}
`

const SMBConnect = styled.div`
	display: flex;
	align-items: center;

	> p {
		margin-right: 3px;
		color: ${props => props.theme.textColors[1]};
	}
`

const SMBConnectionString = styled.div`
	border: 1px solid ${props => props.theme.lightBgColors[1]};
	padding: 2px 5px;
	font-weight: 500;
	display: flex;
	align-items: center;
	cursor: pointer;

	:hover path {
		fill: ${props => props.theme.textColors[0]};
	}

	svg {
		margin-left: 10px;

		path {
			transition: fill .15s ease-in-out;
		}
	}
`

export const DatastoreInfo: React.FC<DatastoreInfoProps> = ({ datastore }) => {

	return (
		<Wrapper>
			<div>
				<Status status={datastore.status}>Status: <p>{capitalize(datastore.status === "init" ? "Initializing" : datastore.status)}</p></Status>
				<Size>Size: <p>{formatSizeInMb(datastore.sizeInMB || 0)} ({datastore.size?.usedPercent}% Used)</p></Size>
			</div>
			<div>
				<SMBConnect>
					<p>SMB connection location: </p>
					<SMBConnectionString onClick={() => copy(datastore.smbConnectString || "")}>
						{datastore.smbConnectString}
						<Icon
							name="copyIcon"
							width={18}
							height={18}
							color={{ propName: "textColors", idx: 1 }}
							viewPort={24}
						/>
					</SMBConnectionString>
				</SMBConnect>
			</div>
		</Wrapper>
	);
}

const capitalize = (s: string) => s.slice(0, 1).toUpperCase().concat(s.slice(1))
const formatSizeInMb = (sizeInMb: number) => sizeInMb > 1024 ? `${(sizeInMb / 1024).toFixed(2)}Gb` : `${sizeInMb}Mb`
