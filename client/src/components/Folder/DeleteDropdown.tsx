import { DeletePtahsMutation } from 'graphql/Folder/deletePaths';
import { LoadingOverlay } from 'src/ui/Button';
import { getTreeQuery } from 'graphql/TreeObject/queryTree';
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react'
import { useApollo } from 'src/hooks/useApollo';
import { useDropdown } from 'src/hooks/useDropdown';
import { FolderContext } from 'src/providers/folderState';
import { BgButton, Button } from 'src/ui/Button';
import styled from 'styled-components';
import { getDirectoryTreeQuery } from 'graphql/TreeObject/queryDirectoryTree';

interface DeleteDropdownProps {
	hide: () => void
}

const Wrapper = styled.div`
	position: absolute;
	padding: 4px 10px 6px 10px;
	box-shadow: 3px 3px 10px 3px #00000012;
	border: 1px solid ${(props) => props.theme.lightBgColors[2]};
	border-radius: 3px;
	background-color: ${(props) => props.theme.lightBgColors[0]};

	h1 {
		padding-bottom: 10px;
		font-size: 25px;
		font-weight: 600;
		color: ${(props) => props.theme.textColors[1]};
	}

	> span {
		display: flex;
		font-size:16px;
		color: ${props => props.theme.textColors[1]};

		> p {
			font-weight: 600;
			color: ${props => props.theme.textColors[1]};
			margin-left: 4px;
		}
	}

	> div {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 10px;
	}
`

export const DeleteDropdown: React.FC<DeleteDropdownProps> = ({ hide }) => {
	const deleteDropdown = useRef<any>()
	useDropdown(deleteDropdown, hide)

	const router = useRouter()
	const { mutate } = useApollo()

	const folderCtx = useContext(FolderContext)
	const count = folderCtx?.selected.selectedItems.size

	const [loading, setLoading] = useState(false)

	const deleteSelected = async () => {
		if (!folderCtx) return;

		const selected = Array.from(folderCtx.selected.selectedItems).map(
			([_, v]) => v
		);

		if (!router.query.d) return;

		if (!selected.length) return;

		try {
			setLoading(true)
			const { data, errors } = await mutate(
				DeletePtahsMutation,
				{
					paths: selected.map(({ isDirectory, relativePath }) => ({
						path: relativePath,
						type: isDirectory ? "directory" : "file",
					})),
					datastoreId: +router.query.d,
				},
				{
					refetchQueries: [
						{
							query: getTreeQuery,
							variables: {
								depth: 1,
								datastoreId: folderCtx.currentFolderPath?.folderPath.datastoreId,
								path: folderCtx.currentFolderPath?.folderPath.path,
							},
						},
						{
							query: getDirectoryTreeQuery,
							variables: {
								depth: 1,
								datastoreId: folderCtx.currentFolderPath?.folderPath.datastoreId,
								path: folderCtx.currentFolderPath?.folderPath.path,
							},
						},
					],
				}
			);
			setLoading(false)

			if (errors) return console.log(errors);

			folderCtx.selected.setSelected?.(new Map());

			console.log(data);
			hide()
		} catch (err) {
			console.log(err)
			setLoading(false)
		}
	};


	return (
		<Wrapper ref={deleteDropdown}>
			<h1>Delete</h1>
			<span>Are you sure you want to delete <p>{count} item{count != 1 && "s"}</p></span>
			<div>
				<Button onClick={hide}>Cancel</Button>
				<LoadingOverlay loading={loading}>
					<BgButton onClick={deleteSelected}>Delete</BgButton>
				</LoadingOverlay>
			</div>
		</Wrapper>
	);
}