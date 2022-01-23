import axios from 'axios'
import { ConditionButton, LoadingOverlay } from 'src/ui/Button'
import { createUploadSessionMutation } from 'graphql/TransferData/createUploadSession'
import React, { useContext, useEffect, useState } from 'react'
import { useApollo } from 'src/hooks/useApollo'
import { FolderContext, FolderContextType } from 'src/providers/folderState'
import { BgButton, Button } from 'src/ui/Button'
import { Scrollbar } from 'src/ui/Scrollbar'
import styled from "styled-components"
import { DriveSelect } from './DriveSelect'
import { filterPaths } from './filterUploadPaths'
import { FolderContent } from "./FolderContent"
import { Path } from "./Path"
import { SelectedContent } from "./SelectedContent"
import { UpdateOwnershipMutation } from 'graphql/Folder/updateOwnership'
import { getTreeQuery } from 'graphql/TreeObject/queryTree'

interface UploadWrapperProps {
	hide: () => void
}
export type SelectedPath = { isDir: boolean, name: string }
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

const PathWrapper = styled.div`
	display: flex;
	max-width: 50%;
	/* overflow-x: auto; */
	align-items: baseline;
`

const Box = styled.div`
	${Scrollbar}

	height: 100%;
	overflow-y: auto;
`

export const UploadWrapper: React.FC<UploadWrapperProps> = ({ hide }) => {
	const folderCtx: FolderContextType = useContext(FolderContext);
	const { mutate } = useApollo()

	const isWin = navigator.platform.toLowerCase().includes("win")

	const [selectedDrive, setSelectedDrive] = useState(isWin ? null : "")
	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState<SelectedPaths>(new Map());
	const [currPath, setCurrPath] = useState("/")

	useEffect(() => {
		setCurrPath("/")
	}, [selectedDrive])


	const upload = async () => {
		const uploadData = filterPaths(selected)
		if (!uploadData.length) return null

		try {
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
							dataStoreId: folderCtx?.currentFolderPath?.folderPath.datastoreId,
						}
					}]
				})

			console.log(res)

			setLoading(false)

			if (data.err) console.log(data.err)
			else hide()
		} catch (e) {
			console.log(e);
			setLoading(false)
		}
	};

	return (
		<Wrapper>
			<Container>
				<Title>Upload</Title>
				<Section style={{ flex: 1 }}>
					<Headers>
						<PathWrapper>
							{isWin && <DriveSelect setSelectedDrive={setSelectedDrive} />}
							<Path path={currPath} setPath={setCurrPath} />
						</PathWrapper>
						<span>Selected<p>({selected.size})</p></span>
					</Headers>
					<BoxWrapper>
						<Box>
							<FolderContent selected={selected} setSelected={setSelected} setPath={setCurrPath} drive={selectedDrive} path={currPath} />
						</Box>
						<Divider />
						<Box>
							<SelectedContent selected={selected} setSelected={setSelected} />
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
						<ConditionButton condition={!loading && !!selected.size}>
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