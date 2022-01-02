import React from 'react';
import { Layout } from 'src/components/Layout';
import { CreateHostNodeView } from 'src/components/Nodes/CreateHostNodeView';
import SideBar from 'src/components/SideBar';
import { withAuth } from 'src/HOC/withAuth';
import { useMeState } from 'src/hooks/useMeState';
import { NextFunctionComponentWithAuth } from 'types/types';

interface createhostProps { }

const CreateHost: NextFunctionComponentWithAuth<createhostProps> = ({ me }) => {
	useMeState(me)

	return (
		<Layout title="Create host">
			<SideBar />
			<CreateHostNodeView />
		</Layout>
	);
}

export default withAuth(CreateHost, (me) => me.isAdmin)