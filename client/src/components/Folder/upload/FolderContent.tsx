import axios from "axios";
import { DriveSelect } from './DriveSelect'
import { Path } from "./Path"
import { LoadingOverlay } from "src/ui/Button";
import { useState, useEffect } from "react";
import fsPath from "path"
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { SelectedPaths } from "./UploadWrapper";

interface FolderContentProps {
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

const PathWrapper = styled.div`
	display: flex;
	width: 100%;
	align-items: baseline;
	/* max-width: 50%; */
	/* overflow-x: auto; */
`


export const FolderContent: React.FC<FolderContentProps> = ({ selected, setSelected }) => {
	const [folderData, setFolderData] = useState<FolderData>([])
	const [loading, setLoading] = useState(false)
	const isWin = navigator.platform.toLowerCase().includes("win")

	const [currPath, setCurrPath] = useState("/")
	const [selectedDrive, setSelectedDrive] = useState(isWin ? null : "")

	const updateFolderData = async () => {
		try {
			setLoading(true)
			const { data, status } = await axios.get(`/api/path/${selectedDrive}${currPath}`);
			setLoading(false)

			if (status === 200) setFolderData(data.data);
		} catch (e) {
			console.log(e)
			setLoading(false)
		}
	};

	useEffect(() => {
		selectedDrive != null &&
			updateFolderData()
	}, [selectedDrive, currPath])


	useEffect(() => {
		setCurrPath("/")
	}, [selectedDrive])

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

	return <LoadingOverlay loading={loading}>
		<PathWrapper>
			{isWin && <DriveSelect setSelectedDrive={setSelectedDrive} />}
			<Path path={currPath} setPath={setCurrPath} />
		</PathWrapper>
		{sort(folderData).map(({ isDirectory, name, path: itemPath }, idx) => {
			return <FolderItem isDirectory={isDirectory} key={idx} selected={selected.has(itemPath)}>
				<FolderEntryIcon isDirectory={isDirectory} />
				<div>
					<span onClick={() => isDirectory && setCurrPath(fsPath.join(currPath, name))}>{name}</span>
				</div>
				<input type="checkbox" onChange={() => { selectItem({ name, path: itemPath, isDirectory }) }} checked={selected.has(itemPath)} />
			</FolderItem>
		})}
		<div style={{ minHeight: 100 }} />
	</LoadingOverlay>

}

interface FolderEntryIconProps {
	isDirectory: boolean
}

export const FolderEntryIcon: React.FC<FolderEntryIconProps> = ({ isDirectory }) => isDirectory ?
	<Icon name="folderIcon" width={18} height={18} color={{ propName: "bgColors", idx: 2 }} viewPort={30} />
	: <Icon name="fileIcon" width={18} height={18} color={{ propName: "bgColors", idx: 2 }} viewPort={26} />
