import { Scrollbar } from "src/ui/Scrollbar"
import styled from "styled-components"


const PathItems = styled.div`
	${Scrollbar}

	display: flex;
	align-items: center;
	width: 100%;
	overflow-x: auto;
`

const Btn = styled.div`
	font-size: 18px;
	padding: 0 3px;
	color: ${props => props.theme.textColors[1]};
	transition: color .1s ease-in-out;
	cursor: pointer;
	display: flex;
	align-items: center;
	white-space: nowrap;

	> p {
		margin-left: 3px;
	}

	:hover {
		color: ${props => props.theme.textColors[0]};
	}
`

const CurrPath = styled.div`
	white-space: nowrap;
	font-size: 18px;
	padding: 0 3px;
	color: ${props => props.theme.textColors[0]};
	font-weight: 600;
`

interface PathProps {
	path: string
	setPath: React.Dispatch<React.SetStateAction<string>>
}

export const Path: React.FC<PathProps> = ({ path, setPath }) => {
	const paths = path.split("/").filter((path) => !!path)

	return <PathItems>
		{paths.length ? <Btn onClick={() => setPath("/")}>/</Btn> : <CurrPath>/</CurrPath>}
		{paths.map((path, idx) => {
			const fullPath = `/${paths.slice(0, idx + 1).join("/")}`
			return idx < paths.length - 1 ?
				<Btn onClick={() => setPath(fullPath)} key={idx}>{path}<p>/</p></Btn>
				: <CurrPath key={idx}>{path}</CurrPath>
		})}
	</PathItems>
}