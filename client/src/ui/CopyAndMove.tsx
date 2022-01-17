
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components"

export const Wrapper = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	top: 0;
	left: 0;
`

export const Container = styled.div`
	background-color: ${props => props.theme.lightBgColors[0]};
	border: 1px solid ${props => props.theme.lightBgColors[1]};
	border-radius: 5px;
	width: 50vw;
	max-width: 1200px;
	min-width: 700px;
	z-index: 100;
	height: 60vh;
	min-height: 500px;
	box-shadow:  0 0 30px 5px #00000012;
	pointer-events: all;
	display: flex;
	flex-direction: column;
	padding: 10px 20px;
`

export const Title = styled.h1`
	color: ${props => props.theme.textColors[0]};
	font-size: 25px;
	font-weight: 600;
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
`

export const BottomContainer = styled.div`
	padding: 10px 0 0 0;
	display: flex;
	color: ${(props) => props.theme.textColors[0]};
	justify-content: space-between;

	p {
		margin-left: 8px;
		color: ${(props) => props.theme.textColors[1]};
		display: flex;
		overflow: hidden;
	}

	span {
		flex: 1;
		overflow: auto;
		color: ${(props) => props.theme.textColors[0]};
		margin-left: 5px;
		font-weight: 500;
		white-space: nowrap;

		${Scrollbar}
	}

	> div {
	display: flex;
	}
`;