import React from 'react'
import { CreateHostNodeForm } from "./CreateHostNodeForm";

interface CreateHostNodeViewProps {

}

export const CreateHostNodeView: React.FC<CreateHostNodeViewProps> = ({ }) => {
	return (
		<div>
			<CreateHostNodeForm />
		</div>

	);
}