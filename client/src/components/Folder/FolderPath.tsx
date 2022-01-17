import React from "react";
import Link from "next/link";
import styled from "styled-components";
import Icon from "src/ui/Icon";
import { Scrollbar } from "src/ui/Scrollbar";

interface FolderPathProps {
  path: string[];
  dataStore: { id: number; name: string | null };
}

const PathWrapper = styled.div`
  padding: 6px 10px;
  width: fit-content;
  display: flex;
  color: ${(props) => props.theme.textColors[1]};
  font-size: 18px;
`;

const PathContainer = styled.div`
  ${Scrollbar}

  width: 100%;
  min-height: 40px;
  overflow-x: auto;
  display: flex;
  align-items: center;
`

const CurrentPath = styled.span`
  color: ${(props) => props.theme.textColors[0]};
  font-weight: 600;
  cursor: default;
  white-space: nowrap;
`;

const Path = styled.span`
  cursor: pointer;
  white-space: nowrap;
`;

const PathArrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 3px;
`;

export const FolderPath: React.FC<FolderPathProps> = ({
  path,
  dataStore: { id, name },
}) => {
  return (
    <PathContainer>
      <PathWrapper>
        <span>
          {path.length && path[0] ? (
            <Link href={`/path?d=${id}`}>
              <div style={{ display: "flex" }}>
                <Path>{name}</Path>
                <PathArrow>
                  <Icon
                    name={"folderArrow"}
                    color={{ idx: 2, propName: "textColors" }}
                    height={16}
                    width={16}
                  />
                </PathArrow>
              </div>
            </Link>
          ) : (
            <Link href={`/datastore/${id}`}>
              <CurrentPath style={{ cursor: "pointer" }}>{name}</CurrentPath>
            </Link>
          )}
        </span>
        {path.map((p, idx) => {
          const isNotCurrentPath = idx < path.length - 1,
            relativePath = path.slice(0, idx + 1).join("/");

          return (
            <div key={idx} style={{ display: "flex" }}>
              {!isNotCurrentPath ? (
                <CurrentPath>{p}</CurrentPath>
              ) : (
                <Link href={`/path/${relativePath}?d=${id}`}>
                  <Path>{p}</Path>
                </Link>
              )}
              {isNotCurrentPath && (
                <PathArrow>
                  <Icon
                    name={"folderArrow"}
                    color={{ idx: 2, propName: "textColors" }}
                    height={16}
                    width={16}
                  />
                </PathArrow>
              )}
            </div>
          );
        })}
      </PathWrapper>
    </PathContainer>
  );
};
