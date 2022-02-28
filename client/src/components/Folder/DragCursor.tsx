import React, { createRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface DragCursorProps {
	selectedCount: number
}

const DragCursorWrapper = styled.div`
	position: fixed;
	z-index: 4000;
	background-color: ${props => props.theme.lightBgColors[1]};
	padding: 3px 6px;
	border-radius: 2px;
	font-size: 20;
	color: ${props => props.theme.textColors[1]};
	display: flex;
	pointer-events: none;
	box-shadow: 2px 2px 10px 2px #00000029;

	> p {
		font-weight: 500;
		color: ${props => props.theme.textColors[0]};
		margin-right: 5px;
	}
`

export const DragCursor: React.FC<DragCursorProps> = ({ selectedCount }) => {
	const ref = createRef<HTMLDivElement>()
	const [pos, setPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

	useEffect(() => {
		const handler = ({ screenX, screenY }: DragEvent) => {
			setPos({ x: screenX, y: screenY - 100 })
		}

		document.addEventListener("drag", handler)

		return () => {
			document.removeEventListener("drag", handler)
		}
	}, [ref])

	return !!pos.x && !!pos.y ? <DragCursorWrapper ref={ref} style={{ top: pos.y, left: pos.x }} >
		<p>{selectedCount}</p> Item{selectedCount !== 1 && "s"}
	</DragCursorWrapper> : null
}