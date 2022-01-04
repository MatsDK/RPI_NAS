import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Select } from "../../../ui/Select"

interface DriveSelectProps {
	setSelectedDrive: React.Dispatch<React.SetStateAction<string | null>>
}

const SelectItem = styled.div`
	padding: 1px 15px;
	cursor: pointer;
	
	:hover {
		background-color: ${props => props.theme.lightBgColors[1]};
	}
`

export const DriveSelect: React.FC<DriveSelectProps> = ({ setSelectedDrive }) => {
	const [drives, setDrives] = useState<{ name: string }[]>([]);

	useEffect(() => {
		axios.get("/api/getdrives").then((res) => {
			setDrives(res.data.drives.map((d: any) => ({ name: d.mountpoints[0].path.slice(0, 2) + "/" })));
		});
	}, [])

	return (
		<Select
			data={drives}
			label="Drive"
			renderItem={(item, idx, select) => <SelectItem onClick={select} key={idx}>{item.name}</SelectItem>}
			uniqueKey="name"
			selectedLabelKey="name"
			setValue={(drive) => setSelectedDrive(drive.name.slice(0, 2))}
			width={100}
		/>
	);
}