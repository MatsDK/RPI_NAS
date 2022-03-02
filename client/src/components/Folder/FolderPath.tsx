
import React, { useContext } from "react";
import Link from "next/link";
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";
import { useDrop } from "react-dnd";
import { FolderContext } from "src/providers/folderState";
import { useApollo } from "src/hooks/useApollo";

interface FolderPathProps {
	path: string[];
	datastore: { id: number; name: string | null };
}

const PathWrapper = styled.div`
	padding: 6px 10px;
	width: fit-content;
	display: flex;
	color: ${(props) => props.theme.textColors[1]};
	font-size: 18px;
`;

const PathContainer = styled.div`
	${Scrollbar}
	width: 100%;
	min-height: 40px;
	overflow-x: auto;
	display: flex;
	align-items: center;
`

const CurrentPath = styled.span`
	color: ${(props) => props.theme.textColors[0]};
	font-weight: 600;
	cursor: default;
	white-space: nowrap;
`;

interface PathProps {
	canDrop: boolean
	isOver: boolean
}

const Path = styled.span<PathProps>`
	cursor: pointer;
	white-space: nowrap;

	padding: ${props => props.canDrop ? "0px 2px" : "1px 3px"};
	border: ${props => props.canDrop ? `1px dashed ${props.isOver ? props.theme.bgColors[0] : props.theme.lightBgColors[2]}` : "none"};
`;

const PathArrow = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 3px;
`;

export const FolderPath: React.FC<FolderPathProps> = ({
	path,
	datastore: { id, name },
}) => {
	const folderCtx = useContext(FolderContext)
	const { mutate } = useApollo()

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: "any",
			canDrop: () => folderCtx?.currentFolderPath?.folderPath.datastoreId === id &&
				folderCtx?.currentFolderPath?.folderPath.path !== "",
			drop: (_item) => {
				const currentPath = folderCtx?.currentFolderPath?.folderPath.path
				currentPath != null &&
					folderCtx?.moveSelected(folderCtx.selected.selectedItems,
						{ path: "", datastoreId: id, currentPath }
						, mutate
					)
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			})
		}),
		[folderCtx]
	)

	return (
		<PathContainer>
			<PathWrapper>
				<span>
					{path.length && path[0] ? (
						<Link href={`/path?d=${id}`}>
							<div style={{ display: "flex" }}>
								<Path ref={drop} canDrop={canDrop} isOver={isOver}>{name}</Path>
								<PathArrow>
									<Icon
										name={"folderArrow"}
										color={{ idx: 2, propName: "textColors" }}
										height={16}
										width={16}
									/>
								</PathArrow>
							</div>
						</Link>
					) : (
						<Link href={`/datastore/${id}`}>
							<CurrentPath style={{ cursor: "pointer" }}>{name}</CurrentPath>
						</Link>
					)}
				</span>
				{path.map((p, idx) => {
					const isNotCurrentPath = idx < path.length - 1,
						relativePath = path.slice(0, idx + 1).join("/");

					return (
						<PathItem key={idx} id={id} path={p} isNotCurrentPath={isNotCurrentPath} relativePath={relativePath} />
					);
				})}
			</PathWrapper>
		</PathContainer>
	);
};

interface PathItemProps {
	id: number
	path: string
	isNotCurrentPath: boolean
	relativePath: string
}

const PathItem: React.FC<PathItemProps> = ({ id, path, isNotCurrentPath, relativePath }) => {
	const folderCtx = useContext(FolderContext)
	const { mutate } = useApollo()

	const datastoreId = folderCtx?.currentFolderPath?.folderPath.datastoreId

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: "any",
			canDrop: () => isNotCurrentPath,
			drop: (_item) => {
				const currentPath = folderCtx?.currentFolderPath?.folderPath.path
				datastoreId != null && currentPath != null &&
					folderCtx?.moveSelected(folderCtx.selected.selectedItems,
						{ datastoreId, path, currentPath },
						mutate
					)
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			})
		}),
		[isNotCurrentPath, folderCtx]
	)

	return <div style={{ display: "flex" }}>
		{!isNotCurrentPath ? (
			<CurrentPath>{path}</CurrentPath>
		) : (
			<Link href={`/path/${relativePath}?d=${id}`}>
				<Path ref={drop} isOver={isOver} canDrop={canDrop}>{path}</Path>
			</Link>
		)}
		{isNotCurrentPath && (
			<PathArrow>
				<Icon
					name={"folderArrow"}
					color={{ idx: 2, propName: "textColors" }}
					height={16}
					width={16}
				/>
			</PathArrow>
		)}
	</div>

}