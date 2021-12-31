import React from 'react'
import { ClipLoader } from 'react-spinners';

interface SpinnerProps {
	loading: boolean

}

export const Spinner: React.FC<SpinnerProps> = ({ loading }) => {
	return (
		<ClipLoader color={"#000000"} loading={loading} size={16} />
	);
}