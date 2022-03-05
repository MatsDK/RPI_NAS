import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import { ThemeProvider } from "styled-components";
import { AppProps } from "next/app";
import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import withApollo from "src/HOC/withApollo";
import {
	CurrentFolderType,
	FolderContext,
	moveSelected
} from "src/providers/folderState";
import "../css/global.css";
import { theme } from "src/utils/theme";
import { MeContext } from "src/providers/meState";
import { TreeItem } from "generated/apolloComponents";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface Props {
	apolloClient: ApolloClient<NormalizedCacheObject>;
	githubApolloClient: ApolloClient<NormalizedCacheObject>;
}

const MyApp = (props: AppProps & Props) => {
	const { Component, pageProps, apolloClient } = props;

	const [folderPath, setFolderPath] = useState<CurrentFolderType>({
		path: null,
		datastoreId: null,
		datastoreName: null,
	});
	const [showNewFolderInput, setShowNewFolderInput] = useState(false);

	const [me, setMe] = useState<any>(null);
	const [selectedItems, setSelected] = useState<Map<string, TreeItem>>(
		new Map()
	);

	const Selected = {
		selected: new Map(),
		selectedItems,
		setSelected,
	};

	return (
		<ApolloProvider client={apolloClient}>
			<FolderContext.Provider
				value={{
					currentFolderPath: { folderPath, setFolderPath },
					selected: Selected,
					newFolderInput: {
						showNewFolderInput,
						setShowNewFolderInput,
					},
					moveSelected
				}}
			>
				<MeContext.Provider value={{ me, setMe }}>
					<DndProvider backend={HTML5Backend}>
						<ThemeProvider theme={theme}>
							<Component {...pageProps} />
						</ThemeProvider>
					</DndProvider>
				</MeContext.Provider>
			</FolderContext.Provider>
		</ApolloProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
	let pageProps = {};

	if (Component.getInitialProps)
		pageProps = await Component.getInitialProps(ctx);

	return { pageProps };
};

export default withApollo(MyApp);
