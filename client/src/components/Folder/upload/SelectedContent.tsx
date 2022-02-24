import React from 'react'
import Icon from "../../../ui/Icon"
import { SelectedPath, SelectedPaths } from './UploadWrapper';
import { FolderEntryIcon } from "./FolderContent"
import styled from 'styled-components';

interface SelectedContentProps {
	selected: {
		selected: SelectedPaths;
		setSelected: React.Dispatch<React.SetStateAction<SelectedPaths>>;
	};
	dropped: {
		dropSelected: SelectedPaths;
		setDropSelected: React.Dispatch<React.SetStateAction<SelectedPaths>>;
	};
	showSelected: boolean
}

type Items = Array<[string, SelectedPath]>

const SelectedEntry = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	padding: 2px 10px 2px 5px;

	:hover > div:last-child {
		opacity: 1;
	}

	> div:last-child {
		cursor: pointer;
		opacity: 0;
		transition: opacity .15s ease-in-out;



		svg path {
			transition: fill .15s ease-in-out;
		}
		:hover svg path {
			fill: ${props => props.theme.bgColors[0]};
		}
	}
`

const Name = styled.div`
	position: relative;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	> span {
		color: ${props => props.theme.textColors[0]};
		margin-left: 5px;
	}

	> span > p {
		position: absolute;
		background-color: ${props => props.theme.bgColors[1]};
		color: ${(props) => props.theme.textColors[3]};
		z-index: 200;
		opacity: 0;
		padding: 1px 10px;
		box-shadow: 2px 2px 5px 2px #00000063;
		border-radius: 2px;
		transition: 0.14s ease-in-out;
		font-size: 16px;
		pointer-events: none;

	}

	> span:hover > p {
		opacity: 1;
	}
`

export const SelectedContent: React.FC<SelectedContentProps> = ({ selected: { selected, setSelected }, dropped: { dropSelected, setDropSelected }, showSelected }) => {
	return (
		<div>
			{(Array.from(showSelected ? selected : dropSelected) as unknown as Items).map(([path, { isDir, name }], idx) =>
				<SelectedEntry key={idx}>
					<FolderEntryIcon isDirectory={isDir} />
					<Name>
						<span>{name}
							{showSelected && <p>{path.replace(/\\/g, "/")}</p>}
						</span>
					</Name>

					<div onClick={() => {
						if (showSelected) {
							selected.delete(path)
							setSelected(() => new Map(selected))
						} else {
							dropSelected.delete(path)
							setDropSelected(() => new Map(dropSelected))
						}
					}}>
						<Icon name="removeIcon" width={20} height={20} viewPort={20} color={{ propName: "textColors", idx: 1 }} />
					</div>
				</SelectedEntry>
			)}
			<div style={{ minHeight: 100 }} />
		</div>
	);
}