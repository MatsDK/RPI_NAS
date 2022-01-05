import axios from "axios";
import { useState, useEffect } from "react";
import fsPath from "path"
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { SelectedPaths } from "./UploadWrapper";

interface FolderContentProps {
	drive: null | string
	path: string
	setPath: React.Dispatch<React.SetStateAction<string>>
	selected: SelectedPaths
	setSelected: React.Dispatch<React.SetStateAction<SelectedPaths>>
}
type FolderData = Array<{ name: string; path: string; isDirectory: boolean }>;

const sort = (data: FolderData) =>
	data.sort((a, b) => (b.isDirectory as any) - (a.isDirectory as any))

type FolderItemProps = { isDirectory: boolean, selected: boolean }
const FolderItem = styled.div<FolderItemProps>`
	width: 100%;
	display: flex;
	align-items: center;
	padding: 2px 10px 2px 5px;

	> div {
		flex: 1;

		> span {
			margin-left: 5px;
			color: ${props => props.theme.textColors[0]};
			cursor: ${props => props.isDirectory ? "pointer" : "default"};

			:hover {
				text-decoration: ${props => props.isDirectory ? "underline" : "none"};
			}
		}
	}

	> input {
		opacity:  ${props => props.selected ? 1 : 0};
		transition: opacity .15s ease-in-out;

	}

	:hover > input {
		opacity: 1;
	}
`

export const FolderContent: React.FC<FolderContentProps> = ({ drive, path, setPath, selected, setSelected }) => {
	const [folderData, setFolderData] = useState<FolderData>([])
	const [loading, setLoading] = useState(false)

	const updateFolderData = async () => {
		try {
			setLoading(true)
			const { data, status } = await axios.get(`/api/path/${drive}${path}`);
			setLoading(false)

			if (status === 200) setFolderData(data.data);
		} catch (e) {
			console.log(e)
			setLoading(false)
		}
	};

	useEffect(() => {
		drive != null &&
			updateFolderData()
	}, [drive, path])

	const selectItem = (item: {
		name: string;
		path: string;
		isDirectory: boolean;
	}) => {
		if (!selected.has(item.path)) {
			setSelected(
				(selectedPaths) =>
					new Map(
						selectedPaths.set(item.path, {
							isDir: item.isDirectory,
							name: item.name
						})
					)
			);
		} else {
			selected.delete(item.path);
			setSelected((selectedPaths) => new Map(selectedPaths));
		}
	};

	return <div>
		{loading ? <div>Loading</div> : sort(folderData).map(({ isDirectory, name, path: itemPath }, idx) => {
			return <FolderItem isDirectory={isDirectory} key={idx} selected={selected.has(itemPath)}>
				<FolderEntryIcon isDirectory={isDirectory} />
				<div>
					<span onClick={() => isDirectory && setPath(fsPath.join(path, name))}>{name}</span>
				</div>
				<input type="checkbox" onChange={() => { selectItem({ name, path: itemPath, isDirectory }) }} checked={selected.has(itemPath)} />
			</FolderItem>
		})}
		<div style={{ minHeight: 100 }} />
	</div>

}

interface FolderEntryIconProps {
	isDirectory: boolean
}

export const FolderEntryIcon: React.FC<FolderEntryIconProps> = ({ isDirectory }) => isDirectory ?
	<Icon name="folderIcon" width={18} height={18} color={{ propName: "bgColors", idx: 2 }} viewPort={30} />
	: <Icon name="fileIcon" width={18} height={18} color={{ propName: "bgColors", idx: 2 }} viewPort={26} />
