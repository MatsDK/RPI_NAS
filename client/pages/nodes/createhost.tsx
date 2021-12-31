import React from 'react'
import SideBar from 'src/components/SideBar';
import { Layout } from 'src/components/Layout';
import { withAuth } from 'src/HOC/withAuth';
import { CreateHostNodeView } from 'src/components/Nodes/CreateHostNodeView';
import { useMeState } from 'src/hooks/useMeState';
import { NextFunctionComponentWithAuth } from 'types/types';
import { useRouter } from 'next/router';

interface createhostProps {

}

const CreateHost: NextFunctionComponentWithAuth<createhostProps> = ({ me }) => {
	useMeState(me)
	const router = useRouter()

	if (me && !me.isAdmin) {
		router.back();
	}

	return (
		<Layout title="Create host">
			<SideBar />
			<CreateHostNodeView />
		</Layout>
	);
}

export default withAuth(CreateHost)