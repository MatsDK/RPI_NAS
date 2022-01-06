import { Datastore } from 'generated/apolloComponents';
import React from 'react'
import styled from 'styled-components';

interface DatastoreInfoProps {
	datastore: Datastore
}

const Wrapper = styled.div`
	margin: 20px 0;
	display: flex;

	> div:not(:first-child) {
		margin-left:20px;
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

export const DatastoreInfo: React.FC<DatastoreInfoProps> = ({ datastore }) => {
	return (
		<Wrapper>
			<Status status={datastore.status}>Status: <p>{capitalize(datastore.status)}</p></Status>
			<Size>Size: <p>{formatSizeInMb(datastore.sizeInMB || 0)} ({datastore.size?.usedPercent}% Used)</p></Size>
		</Wrapper>
	);
}

const capitalize = (s: string) => s.slice(0, 1).toUpperCase().concat(s.slice(1))
const formatSizeInMb = (sizeInMb: number) => sizeInMb > 1024 ? `${(sizeInMb / 1024).toFixed(2)}Gb` : `${sizeInMb}Mb`
