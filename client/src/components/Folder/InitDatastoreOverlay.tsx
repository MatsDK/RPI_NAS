import React from 'react'
import styled from 'styled-components';
import Link from "next/link"

interface InitDatastoreOverlayProps {
	datastoreName: string
	datastoreId: number
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;

	> span {
		font-size: 18px;
		color: ${(props) => props.theme.textColors[1]};
	}

	a {
		color: ${(props) => props.theme.textColors[0]};
		font-weight: 600;
		cursor: pointer;
	}
`

const Title = styled.h1`
    font-weight: 500;
    font-size: 25px;
    color: ${(props) => props.theme.textColors[0]};
`

const DatastoreLink = styled(Link)`
`

export const InitDatastoreOverlay: React.FC<InitDatastoreOverlayProps> = ({ datastoreName, datastoreId }) => {

	return (
		<Wrapper>
			<Title>Initialize {datastoreName}</Title>
			<span>You have to initialize <DatastoreLink href={`/datastore/${datastoreId}`}>{datastoreName}</DatastoreLink> to use it</span>
		</Wrapper>
	);
}