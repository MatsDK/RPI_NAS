import React from "react";
import Link from "next/link";
import styled from "styled-components";

interface FolderPathProps {
  path: string[];
  dataStore: { id: number; name: string | null };
}

const PathWrapper = styled.div`
  padding: 4px 10px;
  display: flex;
`;

export const FolderPath: React.FC<FolderPathProps> = ({
  path,
  dataStore: { id, name },
}) => {
  return (
    <PathWrapper>
      <span>
        {path.length && path[0] ? (
          <Link href={`/path?d=${id}`}>
            <span>{name}/</span>
          </Link>
        ) : (
          name
        )}
      </span>
      {path.map((p, idx) => {
        const isNotCurrentPath = idx < path.length - 1,
          relativePath = path.slice(0, idx + 1).join("/");

        return (
          <div key={idx}>
            {!isNotCurrentPath ? (
              p
            ) : (
              <Link href={`/path/${relativePath}?d=${id}`}>
                <span>{p}</span>
              </Link>
            )}
            {isNotCurrentPath && "/"}
          </div>
        );
      })}
    </PathWrapper>
  );
};
