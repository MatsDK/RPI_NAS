import React, { useState } from 'react'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { SelectedPaths } from './UploadWrapper';

interface DropFilesContainerProps {
	selected: SelectedPaths
	setSelected: React.Dispatch<React.SetStateAction<SelectedPaths>>
}

const Dropzone = styled.div<{ dragOver: boolean }>`
	width: calc(100% - 20px);
	height: calc(100% - 40px);
	border-radius: 5px;
	border: ${props => props.dragOver ? 2 : 1}px dashed ${props => props.dragOver ? props.theme.bgColors[0] : props.theme.lightBgColors[2]};
	transition: .1s ease-in-out;
	outline: none;
	cursor: pointer;
	margin: 10px;
`

const DropzoneText = styled.div`
	height: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	> h1 {
		font-size: 24px;
		color: ${props => props.theme.textColors[0]};
	}

	> p {
		font-size: 18px;
		color: ${props => props.theme.textColors[2]};
	}
`

export const DropFilesContainer: React.FC<DropFilesContainerProps> = ({ selected, setSelected }) => {
	const [dragOver, setDragOver] = useState(false)

	const onDrop = (files: File[], rejectedFiles: FileRejection[], e: DropEvent) => {
		setDragOver(false)

		for (const file of files) {
			setSelected(s => {
				const newMap = new Map(s)
				newMap.set(file.name, { isDir: false, name: file.name, file })

				return newMap
			})
		}
	}

	const { getRootProps, getInputProps } = useDropzone({
		onDrop, onDragEnter: () => setDragOver(true), onDragLeave: () => setDragOver(false),
	})

	return (
		<Dropzone  {...{ ...getRootProps(), dragOver }}>
			<input {...getInputProps()} />
			<DropzoneText>
				<h1>Drop files here</h1>
				<p>click to select files</p>
			</DropzoneText>
		</Dropzone>
	);
}