import axios from 'axios'
import { UpdateOwnershipMutation } from 'graphql/Folder/updateOwnership'
import { createUploadSessionMutation } from 'graphql/TransferData/createUploadSession'
import { UploadFilesMutation } from 'graphql/TransferData/UploadFilesMutatin'
import { getTreeQuery } from 'graphql/TreeObject/queryTree'
import React, { useContext, useState } from 'react'
import { useApollo } from 'src/hooks/useApollo'
import { FolderContext, FolderContextType } from 'src/providers/folderState'
import { BgButton, Button, ConditionButton, LoadingOverlay } from 'src/ui/Button'
import { Scrollbar } from 'src/ui/Scrollbar'
import styled from "styled-components"
import { DropFilesContainer } from './DropFilesContainer'
import { filterPaths } from './filterUploadPaths'
import { FolderContent } from "./FolderContent"
import { SelectedContent } from "./SelectedContent"

interface UploadWrapperProps {
	hide: () => void
}
export type SelectedPath = { isDir: boolean, name: string, file?: File }
export type SelectedPaths = Map<string, SelectedPath>;

const Wrapper = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	top: 0;
	left: 0;
`

const Container = styled.div`
	background-color: ${props => props.theme.lightBgColors[0]};
	border: 1px solid ${props => props.theme.lightBgColors[1]};
	border-radius: 5px;
	width: 50vw;
	max-width: 1200px;
	min-width: 700px;
	z-index: 100;
	height: 60vh;
	min-height: 500px;
	box-shadow:  0 0 30px 5px #00000012;
	pointer-events: all;
	display: flex;
	flex-direction: column;
	padding: 10px 20px;
`

const Bottom = styled.div`
	display: flex;
	justify-content: space-between; 
	align-items: center;
	height: 40px;

	> div {
		display: flex;
	}

	> span {
		display: flex;
		color: ${props => props.theme.textColors[1]};

		> p {
			color: ${props => props.theme.textColors[0]};
			margin-left: 3px;
			font-weight: 600;
		}
	}
`

const Title = styled.h1`
	color: ${props => props.theme.textColors[0]};
	font-size: 25px;
	font-weight: 600;
	display: flex;
	flex-direction: column;

	> span {
		color: ${props => props.theme.textColors[1]};
		font-size: 16px;
		margin-top: -5px;
		font-weight: normal;
	}

	margin-bottom: 20px;
`

const Section = styled.div`
	flex: 1;
	width: 100%;
	height: 100%;
	overflow: hidden;
`

const BoxWrapper = styled.div`
	display: flex;
	width: 100%;
	height: 100%;

	> div {
		width: 50%;
	}
`


const Divider = styled.div`
	width: 1px !important;
	height: 100%;
	background-color: ${props => props.theme.lightBgColors[2]};
`

const Headers = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	> span {
		width: 50%;
		padding:  0 0 5px 0;
		font-weight: 600;
		display: flex;
		color: ${props => props.theme.textColors[0]};

		:first-child {
			padding-left: 10px;
		}

		p  {
			color: ${props => props.theme.textColors[1]};
			font-weight: normal;
		}
	}
`

const Box = styled.div`
	${Scrollbar}

	height: 100%;
	overflow-y: auto;
`

const TabHeaders = styled.div`
	display: flex;
`

const TabHeader = styled.span<{ selected: boolean }>`
	color: ${props => props.theme.textColors[0]};
	font-weight: 500;
	cursor: pointer;

	:first-child {
		margin-right: 15px;
	}

	text-decoration: ${props => props.selected ? "underline" : "none"};
`

export const UploadWrapper: React.FC<UploadWrapperProps> = ({ hide }) => {
	const folderCtx: FolderContextType = useContext(FolderContext);
	const { mutate } = useApollo()

	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState<SelectedPaths>(new Map());
	const [dropSelected, setDropSelected] = useState<SelectedPaths>(new Map());

	const [dropFilesSelected, setDropFilesSelected] = useState(false)

	const uploadSelectedFiles = async () => {
		const uploadData = filterPaths(selected)
		if (!uploadData.length) return { err: "no files selected" }

		setLoading(true)
		const {
			data: {
				createUploadSession: { uploadPath, ...connectionData },
			},
		} = await mutate(createUploadSessionMutation, {
			uploadPath: folderCtx?.currentFolderPath?.folderPath.path,
			dataStoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
		});

		const { data } = await axios.get(`/api/upload`, {
			params: {
				data: {
					connectionData,
					uploadPath,
					uploadData,
				},
			},
		});

		const res = await mutate(UpdateOwnershipMutation,
			{ datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId },
			{
				refetchQueries: [{
					query: getTreeQuery, variables: {
						depth: 1,
						path: folderCtx?.currentFolderPath?.folderPath.path,
						datastoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
					}
				}]
			})

		console.log(res)

		setLoading(false)

		return { err: data.err }
	}

	const upload = async () => {
		try {
			if (!dropFilesSelected) {
				const { err } = await uploadSelectedFiles()
				return console.log(err);
			} else {
				const files = Array.from(dropSelected).map(([_path, { file }]) => file),
					{ datastoreId, path } = folderCtx?.currentFolderPath?.folderPath!

				try {

					setLoading(true)
					const res = await mutate(UploadFilesMutation,
						{
							files,
							datastoreId,
							path: path || "/",
						},
						{
							refetchQueries: [
								{
									query: getTreeQuery,
									variables: { datastoreId, path, depth: 1 }
								}
							]
						}
					)
					setLoading(false)

					console.log(res);
				} catch (err) {
					console.log(err);
					setLoading(false)
				}
			}

			// hide()
		} catch (e) {
			console.log(e);
			setLoading(false)
		}
	};

	const selectedData = {
		selected: {
			selected,
			setSelected
		},
		dropped: {
			dropSelected,
			setDropSelected
		}
	}

	return (
		<Wrapper>
			<Container>
				<Title>Upload</Title>
				<Section style={{ flex: 1 }}>
					<Headers>
						<TabHeaders>
							<TabHeader onClick={() => setDropFilesSelected(true)} selected={dropFilesSelected}>Drop files</TabHeader>
							<TabHeader onClick={() => setDropFilesSelected(false)} selected={!dropFilesSelected}>Select files</TabHeader>
						</TabHeaders>
						<span>Selected<p>({dropFilesSelected ? dropSelected.size : selected.size})</p></span>
					</Headers>
					<BoxWrapper>
						<Box>
							{!dropFilesSelected ?
								<FolderContent selected={selected} setSelected={setSelected} />
								: <DropFilesContainer selected={dropSelected} setSelected={setDropSelected} />}
						</Box>
						<Divider />
						<Box>
							<SelectedContent {...selectedData} showSelected={!dropFilesSelected} />
						</Box>
					</BoxWrapper>
				</Section>
				<Bottom>
					<span>
						Upload to:
						<p>{folderCtx?.currentFolderPath?.folderPath.datastoreName}/{folderCtx?.currentFolderPath?.folderPath.path}</p>
					</span>
					<div>
						<Button onClick={hide}>Cancel</Button>
						<ConditionButton condition={!loading && ((!dropFilesSelected && !!selected.size) || (dropFilesSelected && !!dropSelected.size))}>
							<LoadingOverlay loading={loading}>
								<BgButton onClick={upload}>Upload</BgButton>
							</LoadingOverlay>
						</ConditionButton>
					</div>
				</Bottom>
			</Container>
		</Wrapper>
	);
}