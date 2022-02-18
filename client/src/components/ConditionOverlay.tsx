import React from 'react'
import styled from 'styled-components';

interface ConditionOverlayProps {
	condition: boolean
	renderOverlay: () => JSX.Element
}

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;

	> div {
		width: 100%;
		height: 100%;
	}
`

interface OverlayProps {
	show: boolean
}

const Children = styled.div<OverlayProps>`
	opacity: ${props => props.show ? .3 : 1};
	transition: opacity .15s ease-in-out;

`

const Overlay = styled.div<OverlayProps>`
	position: absolute;
	top: 0;
	left: 0;

	opacity: ${props => props.show ? 1 : 0};
	pointer-events: ${props => props.show ? "all" : "none"};
	
	display: grid;
	place-items: center;
`

export const ConditionOverlay: React.FC<ConditionOverlayProps> = ({ condition, children, renderOverlay }) => {
	return (
		<Wrapper>
			<Children show={condition}>{children}</Children>
			<Overlay show={condition}>{renderOverlay()}</Overlay>
		</Wrapper>
	);
}