import React from 'react'

interface InitializeUserFormProps {
	datastoreId: number
	datastoreName: string
}

export const InitializeUserForm: React.FC<InitializeUserFormProps> = ({ datastoreName }) => {
	return (
		<div>
			Input your password to use {datastoreName}
		</div>
	);
}