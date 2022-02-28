import { TreeItem } from "generated/apolloComponents";
import Link from "next/link";
import { useRouter } from "next/router";
import prettyBytes from "pretty-bytes";
import React, { useContext, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import Icon from "src/ui/Icon";
import styled from "styled-components";
import { DragCursor } from "./DragCursor";

interface Props {
	item: TreeItem & { idx?: number };
	datastoreId: number | null;
	idx: number
	items: TreeItem[]
}

interface FolderItemWrapperProps {
	selected: boolean
	canDrop: boolean
	isOver: boolean
}

export const FolderItemWrapper = styled.div<FolderItemWrapperProps>`
	margin: 1px 5px;
	display: flex;
	align-items: center;
	width: 100%;

	background-color: ${props => props.selected ? props.theme.lightBgColors[1] : props.theme.lightBgColors[0]};
	padding: ${props => props.canDrop ? "1px 2px" : "2px 3px"};
	border: ${props => props.canDrop ? `1px dashed ${props.isOver ? props.theme.bgColors[0] : props.theme.lightBgColors[2]}` : "none"};

	:hover input[type="checkbox"] {
		opacity: 1;
	}
`;

export const IconWrapper = styled.div`
	width: 28px;
	margin-right: 10px;

	svg {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
`;

const SelectButtonWrapper = styled.div`
	padding-right: 15px;
	padding-left: 10px;

	input:not(:checked) {
		opacity: 0;
	}
`;

const FolderButtonItem = styled.p`
	cursor: pointer;
	width: fit-content;

	:hover {
		text-decoration: underline;
	}
`;

const Info = styled.div`
	flex: 1;

	> div {
		display: flex;
	}
`

const Name = styled.p`
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: -moz-none;
	-o-user-select: none;
	user-select: none;
	width: 50%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

const Size = styled.p`
	color: ${props => props.theme.textColors[1]};
`

const FolderItem: React.FC<Props> = ({ item, datastoreId, idx, items }) => {
	const folderCtx: FolderContextType = useContext(FolderContext);
	const router = useRouter();

	const [selected, setSelected] = useState(false);

	const [{ isDragging }, drag, preview] = useDrag(
		() => ({
			type: "any",
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[],
	)

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: "any",
			canDrop: () => item.isDirectory && !isSelected(item, folderCtx?.selected.selectedItems || new Map()),
			drop: (_item) => {
				console.log("drop", item);
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		})
	)

	item.idx = idx

	useEffect(() => {
		setSelected(!!folderCtx?.selected.selectedItems.has(item.path));
	}, [item, folderCtx]);

	if (!folderCtx) return null

	const updateSelected = (ctrlKey: boolean, shiftKey: boolean) => {
		if (ctrlKey) {
			if (folderCtx.selected.selectedItems.has(item.path))
				folderCtx.selected.selectedItems.delete(item.path)
			else
				folderCtx.selected.selectedItems.set(item.path, item)

			folderCtx.selected.setSelected(new Map(folderCtx.selected.selectedItems))
		} else if (shiftKey) {
			if (folderCtx.selected.selectedItems.size == 0) {
				folderCtx.selected.selectedItems.set(item.path, item)
				folderCtx.selected.setSelected(new Map(folderCtx.selected.selectedItems))
			} else {
				const lastItem: any = (Array.from(folderCtx.selected.selectedItems || new Map()).pop())
				if (!lastItem) return

				if (lastItem[1].idx == idx) {
					folderCtx.selected.selectedItems.delete(item.path)
					folderCtx.selected.setSelected(new Map(folderCtx.selected.selectedItems))
				}

				for (let i = Math.min(lastItem[1].idx, idx) + 1; i < Math.max(lastItem[1].idx, idx); i++) {
					folderCtx.selected.setSelected(new Map(folderCtx.selected.selectedItems.set(items[i].path, items[i])))
				}
				folderCtx.selected.setSelected(new Map(folderCtx.selected.selectedItems.set(item.path, item)))
			}
		} else {
			if (folderCtx.selected.selectedItems.has(item.path))
				folderCtx.selected.setSelected(new Map());
			else folderCtx.selected.setSelected(new Map([[item.path, item]]));
		}
	}

	useEffect(() => {
		preview(getEmptyImage(), { captureDraggingState: true, })
	}, [])

	useEffect(() => {
		if (isDragging) {
			if (folderCtx.selected.selectedItems.size === 0 ||
				!isSelected(item, folderCtx.selected.selectedItems)) {
				const newSelected: Map<string, TreeItem> = new Map()
				folderCtx.selected.setSelected(newSelected.set(item.path, item))
			}
		}
		return () => { }
	}, [isDragging])

	return (
		<>
			{isDragging && <DragCursor selectedCount={folderCtx.selected.selectedItems.size} />}
			<div ref={drop}>
				<FolderItemWrapper
					ref={drag}
					canDrop={canDrop}
					isOver={isOver}
					selected={selected}
					onDoubleClick={() =>
						item.isDirectory &&
						router.push(`/path/${item.relativePath}?d=${datastoreId}`)
					}
					onClick={({ ctrlKey, shiftKey }) => updateSelected(ctrlKey, shiftKey)}
				>

					<SelectButtonWrapper
						onClick={(e) => {
							e.stopPropagation();

							if (!folderCtx.selected.selectedItems.has(item.path))
								folderCtx.selected.setSelected(
									(m) => new Map(m.set(item.path, item))
								);
							else
								folderCtx.selected.setSelected((m) => {
									m.delete(item.path);
									return new Map(m);
								});

							setSelected((s) => !s);
						}}
					>
						<input
							type="checkbox"
							checked={selected || false}
							onChange={() => { }}
						/>
					</SelectButtonWrapper>
					<IconWrapper>
						{item.isDirectory ? (
							<Icon
								color={{ idx: 2, propName: "bgColors" }}
								width={24}
								height={22}
								viewPort={30}
								name="folderIcon"
							/>
						) : (
							<div style={{ marginLeft: 2 }}>
								<Icon
									name={"fileIcon"}
									color={{ idx: 2, propName: "bgColors" }}
									height={26}
									width={26}
									viewPort={26}
								/>
							</div>
						)}
					</IconWrapper>
					<Info>
						{item.isDirectory ? (
							<div>
								<Link href={`/path/${item.relativePath}?d=${datastoreId}`}>
									<FolderButtonItem onClick={e => e.stopPropagation()}>{item.name}</FolderButtonItem>
								</Link>
								<p />
							</div>
						) : (
							<div>
								<Name>{item.name}</Name>
								<p>{item.size != null && <Size>{prettyBytes(item.size)}</Size>}</p>
							</div>
						)}
					</Info>
				</FolderItemWrapper >
			</div>
		</>
	);
};

export default FolderItem;

const isSelected = (item: TreeItem, selected: Map<string, TreeItem>) => selected.has(item.path)