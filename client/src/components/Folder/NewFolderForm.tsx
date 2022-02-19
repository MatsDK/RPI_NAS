import { CreateFolderMutation } from 'graphql/Folder/createFolder';
import { getDirectoryTreeQuery } from 'graphql/TreeObject/queryDirectoryTree';
import fsPath from "path";
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { useApollo } from 'src/hooks/useApollo';
import { FolderContext } from 'src/providers/folderState';
import Icon from 'src/ui/Icon';
import styled from 'styled-components';
import { FolderItemWrapper, IconWrapper } from "./FolderItem";
import { update } from './newFolderUpdateQuery';

const NewFolderInput = styled.input`
  border: 0;
  outline: 0;
  padding: 1px 2px;
  font-size: 16px;
  border-bottom: 1px solid ${(props) => props.theme.lightBgColors[2]};
`;

interface NewFolderFormProps {
	path: string
	datastoreId: number
}

export const NewFolderForm: React.FC<NewFolderFormProps> = ({ path, datastoreId }) => {
	const [folderNameInput, setFolderNameInput] = useState("");
	const folderCtx = useContext(FolderContext)
	const { mutate } = useApollo();

	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		if (folderCtx?.newFolderInput?.showNewFolderInput)
			inputRef.current?.focus();
	}, [folderCtx]);

	const createNewFolder = async (e: FormEvent) => {
		e.preventDefault();
		const newPath = fsPath.join(
			folderCtx?.currentFolderPath?.folderPath.path || "",
			folderNameInput
		);

		if (!folderNameInput.trim() || !newPath.trim()) return;

		await mutate(
			CreateFolderMutation,
			{
				path: newPath,
				datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
			},
			{
				refetchQueries: [
					{
						query: getDirectoryTreeQuery,
						variables: {
							depth: 1,
							path: folderCtx?.currentFolderPath?.folderPath.path,
							datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
						},
					},
				],
				update: update(newPath, path, datastoreId)
			},
		);

		folderCtx?.newFolderInput?.setShowNewFolderInput(false);
		setFolderNameInput("");
	};

	return (

		<FolderItemWrapper>
			<div style={{ width: 38 }} />
			<IconWrapper>
				<Icon
					color={{ idx: 2, propName: "bgColors" }}
					width={24}
					height={22}
					viewPort={30}
					name="folderIcon"
				/>
			</IconWrapper>
			<form onSubmit={createNewFolder}>
				<NewFolderInput
					type="text"
					ref={inputRef as any}
					value={folderNameInput}
					onChange={(e) => setFolderNameInput(e.target.value)}
				/>
			</form>
		</FolderItemWrapper>
	);
}