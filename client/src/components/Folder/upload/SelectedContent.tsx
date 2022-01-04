import React from 'react'
import { SelectedPath, SelectedPaths } from './UploadWrapper';

interface SelectedContentProps {
	selected: SelectedPaths
	setSelected: React.Dispatch<React.SetStateAction<SelectedPaths>>
}

type Items = Array<[string, SelectedPath]>

export const SelectedContent: React.FC<SelectedContentProps> = ({ selected, setSelected }) => {
	return (
		<div>
			{(Array.from(selected) as unknown as Items).map(([path, { isDir, name }], idx) => {
				return <div key={idx}>{name}
					<button onClick={() => {
						selected.delete(path)
						setSelected(() => new Map(selected))
					}}>remove</button>
				</div>
			})}
		</div>
	);
}