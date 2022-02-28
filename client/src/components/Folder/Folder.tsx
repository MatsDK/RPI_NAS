import { TreeItem, useGetTreeQueryQuery } from "generated/apolloComponents";
import Link from "next/link";
import React, {
	useContext,
	useEffect, useState
} from "react";
import { useApolloClient } from "react-apollo";
import { FolderContext, FolderContextType } from "src/providers/folderState";
import { Scrollbar } from "src/ui/Scrollbar";
import styled from "styled-components";
import { ConditionOverlay } from "../ConditionOverlay";
import FolderItem from "./FolderItem";
import FolderNavbar from "./FolderNavbar";
import { FolderPath } from "./FolderPath";
import { InitDatastoreOverlay } from "./InitDatastoreOverlay";
import { NewFolderForm } from "./NewFolderForm";

interface Props {
	path: string;
	datastoreId: number | null;
	datastoreName: string;
}

const FolderContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 10px);
`;

const FolderContainer = styled.div`
  ${Scrollbar}

  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Wrapper = styled.div`
  flex: 1;
  overflow: hidden;
`

const Timeout = styled.div`
	color: ${props => props.theme.textColors[1]};
	margin-left: 10px;
	display: flex;

	p {
		color: ${props => props.theme.textColors[0]};
		cursor: pointer;
		margin: 0 3px;
		text-decoration: underline;
	}
`

const sort = (data: any[]) =>
	data.sort((a, b) => (b.isDirectory ? 1 : 0) - (a.isDirectory ? 1 : 0))

const filter = (data: any[], filter: string) =>
	filter ? data.filter(({ name }) => name.includes(filter)) : data

const Folder: React.FC<Props> = ({ path, datastoreId, datastoreName }) => {

	const client: any = useApolloClient();
	const folderCtx: FolderContextType = useContext(FolderContext);

	const [filterInput, setFilterInput] = useState("")

	useEffect(() => {
		if (folderCtx && !folderCtx.currentFolderPath?.folderPath.datastoreName)
			folderCtx.currentFolderPath?.setFolderPath({ path, datastoreId, datastoreName });
	}, [folderCtx]);

	const { data, error, loading } = useGetTreeQueryQuery({
		variables: {
			depth: 1,
			path,
			datastoreId,
		},
		client,
	});

	useEffect(() => {
		if (folderCtx) {
			const { selected, currentFolderPath } = folderCtx;

			folderCtx.selected?.setSelected?.(new Map());

			selected.selectedItems = new Map();
			currentFolderPath?.setFolderPath({ path, datastoreId, datastoreName });
		}

		setFilterInput("")
	}, [path, datastoreId, datastoreName]);

	if (loading) return <div>Loading</div>;
	if (!datastoreId) return null;
	if (error) return <div>error</div>;
	if (!data?.tree?.tree) return <div>folder not found</div>;


	const initialized = !!data?.tree?.userInitialized

	return (
		<Wrapper>
			<ConditionOverlay
				condition={!initialized}
				renderOverlay={() => <InitDatastoreOverlay datastoreName={datastoreName} datastoreId={datastoreId} />}
			>
				<FolderNavbar setFilterInput={setFilterInput} filterInput={filterInput} />
				<FolderContainer>
					<FolderPath
						path={path.split("/")}
						dataStore={{
							id: datastoreId,
							name: datastoreName,
						}}
					/>
					{data.tree.timeout &&
						<Timeout>Connection to <Link href={`/datastore/${datastoreId}`}><p>{datastoreName}</p></Link> timed out</Timeout>
					}
					<FolderContent>
						{folderCtx?.newFolderInput?.showNewFolderInput && (<NewFolderForm path={path} datastoreId={datastoreId} />)}
						{(initialized ? filter(sort(data.tree?.tree), filterInput) : []).map((item, idx) => (
							<FolderItem
								datastoreId={datastoreId}
								item={item as TreeItem}
								idx={idx}
								items={sort(data.tree?.tree || [])}
								key={idx}
							/>
						))}
					</FolderContent>
					<div
						style={{ minHeight: 300, flex: 1 }}
						onClick={() => folderCtx?.selected?.setSelected?.(new Map())}
					></div>
				</FolderContainer>
			</ConditionOverlay>
		</Wrapper>
	);
};

export default Folder;
