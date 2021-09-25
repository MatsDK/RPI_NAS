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
        <Link href={`/path?d=${id}`}>{name}</Link>/
      </span>
      {path.map((p, idx) => {
        const isNotCurrentPath = idx < path.length - 1;

        return (
          <div>
            {!isNotCurrentPath ? (
              p
            ) : (
              <Link
                key={idx}
                href={`/path/${path.slice(0, idx + 1).join("/")}?d=${id}`}
              >
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
