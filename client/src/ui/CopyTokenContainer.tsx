import React from 'react'
import Icon from './Icon';
import styled from 'styled-components';

interface CopyTokenContainerProps {
	token: string
}

const Container = styled.div`
	border: 1px solid ${props => props.theme.lightBgColors[1]};
	margin-left: 10px;
	border-radius: 4px;
	display: flex;
	align-items: center;

	> span {
		padding: 2px 10px;
		position: relative;

		> p {
			position: absolute;
			width:50%;
			height: calc(100% - 4px);
			top: 2px;
			background: linear-gradient(to right, #ffffff00, #fff, #fff);
			right: 0;
		}
	}

	> div {
		cursor: pointer;
		padding-right: 5px;

		path {
			transition: fill .15s ease-in-out;
		}

		:hover path {
			fill: ${props => props.theme.textColors[0]};
		}
	}
`

export const CopyTokenContainer: React.FC<CopyTokenContainerProps> = ({ token }) => {
	const copy = () => {
		if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(token);
		else {
			const textArea = document.createElement("textarea");
			textArea.value = token;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			document.execCommand('copy')
			textArea.remove();
		}
	}

	return (
		<Container>
			<span>{token.slice(0, 12)}<p /></span>
			<div onClick={copy}>
				<Icon
					name="copyIcon"
					width={18}
					height={18}
					color={{ propName: "textColors", idx: 1 }}
					viewPort={24}
				/>
			</div>
		</Container>
	);
}