import React from "react";
import styled from "styled-components";
import Icon from "../../../ui/Icon"

interface PathItemProps {
	clickable: boolean;
}

const PathItem = styled.span<PathItemProps>`
  display: flex;
  align-items: center;
  margin-right: 3px;
  color: ${(props) => props.theme.textColors[3]};

  cursor: ${(props) => (props.clickable ? "pointer" : "default")};

  font-weight: ${(props) => (props.clickable ? "400" : "600")};
`;

const GoToRootButton = styled.div`
  svg {
    transform: scale(1.3);
    margin-right: 14px;
    cursor: pointer;
    margin-bottom: 2px;
  }
`;

interface PathWrapperProps {
	selectedDrive: null | string;
	path: string | null;
	setPath: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FolderPath: React.FC<PathWrapperProps> = ({
	selectedDrive,
	path,
	setPath,
}) => {
	if (!path || !path.split("/")[0] || selectedDrive == null) return null;

	return (
		<div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
			<GoToRootButton onClick={() => setPath("/")}>
				<Icon
					name={"doubleArrow"}
					color={{ idx: 2, propName: "textColors" }}
					viewPort={20}
					height={16}
					width={16}
				/>
			</GoToRootButton>
			{path.split("/").length > 2
				? path
					.split("/")
					.slice(path.split("/").length - 2)
					.map((x, idx) => (
						<PathItem
							clickable={idx != 1}
							onClick={() =>
								setPath(
									path
										.split("/")
										.slice(0, path.split("/").length - 1)
										.join("/")
								)
							}
							key={idx}
						>
							{x}
							{idx != 1 ? (
								<Icon
									name={"folderArrow"}
									color={{ idx: 2, propName: "textColors" }}
									height={16}
									width={16}
								/>
							) : (
								""
							)}
						</PathItem>
					))
				: path.split(`/`).map((x, idx) => (
					<PathItem
						clickable={idx != path.split("/").length - 1}
						onClick={() => {
							const newPath = (path || "")
								.split("/")
								.slice(0, idx + 1)
								.join("/");

							setPath(newPath);
						}}
						key={idx}
					>
						{x}
						{idx != path.split("/").length - 1 ? (
							<Icon
								name={"folderArrow"}
								color={{ idx: 2, propName: "textColors" }}
								height={16}
								width={16}
							/>
						) : (
							""
						)}
					</PathItem>
				))}
		</div>
	);
};