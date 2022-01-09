import { Datastore } from "generated/apolloComponents";
import Link from "next/link";
import { PlaceHolder } from "pages/friends";
import React from "react";
import { useMeState } from "src/hooks/useMeState";
import { ProfilePicturesStack } from "src/ui/ProfilePicturesStack";
import styled from "styled-components";

interface DataStoreListItemProps {
  datastore: Datastore;
  showGoToBtn?: boolean;
}

const DataStoreShared = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const DataStoreSize = styled.div`
  width: 100px;
  position: relative;
  margin-right: 10px;
  display: grid;
  place-items: center;

  > div {
    position: absolute;
    background-color: transparent;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 8px;

    p {
      font-size: 13px;

      span {
        font-weight: 500;
      }

      :last-child {
        color: ${(props) => props.theme.textColors[2]};
      }
    }
  }

  svg {
    top: 5px;
    position: absolute;
  }

  svg:first-child {
    z-index: 2;
    stroke: ${(props) => props.theme.textColors[3]};
  }

  svg:last-child {
    z-index: 3;
    stroke: ${(props) => props.theme.bgColors[2]};
  }
`;

const DataStoreItem = styled.div`
  padding: 15px;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.textColors[3]};
  min-height: 132px;
`;

const DataStoreInfo = styled.div`
  flex: 1;
`;

const DataStoreItemHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 5px 0;
  justify-content: space-between;
`;

const DataStoreOwner = styled.div`
  display: flex;

  label {
    color: ${(props) => props.theme.textColors[2]};
    margin-right: 3px;
  }

  span {
    color: ${(props) => props.theme.textColors[0]};
    font-weight: 500;
  }

  p {
    color: ${(props) => props.theme.textColors[2]};
    font-weight: 500;
    margin-left: 3px;
  }
`;

const DataStoreItemTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${(props) => props.theme.textColors[0]};

  span {
    cursor: pointer;
  }

  button {
    background-color: transparent;
    border: 0;
    color: ${(props) => props.theme.textColors[2]};
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
  }
`;

const DataStoreSharedUsers = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin: 0 6px;
    display: flex;
    margin-top: 5px;

    p {
      color: ${(props) => props.theme.textColors[2]};
    }
  }
`;

const DataStoreSharedHeader = styled.div`
  display: flex;
  align-items: baseline;

  button {
    margin-left: 15px;
    background-color: transparent;
    border: 0;
    color: ${(props) => props.theme.textColors[2]};
    transition: 0.1s ease-in-out;
    cursor: pointer;
    font-size: 15px;

    :hover {
      color: ${(props) => props.theme.textColors[1]};
    }
  }

  > div {
    display: flex;
    align-items: baseline;
    font-size: 17px;
    color: ${(props) => props.theme.textColors[0]};

    p {
      font-size: 14px;
      margin-left: 3px;
      color: ${(props) => props.theme.textColors[2]};
    }
  }
`;

interface StatusSectionProps {
  status: number;
}

const StatusSection = styled.div<StatusSectionProps>`
  display: flex;
  justify-content: space-between;

  > div {
    color: ${(props) => props.theme.textColors[2]};
    display: flex;

    p {
      margin-left: 4px;
      font-weight: 600;

      color: ${(props) => props.theme.statusColors[props.status]};
    }
  }
`;

const InitUserSection = styled.span`
  color: ${props => props.theme.textColors[0]};
  background-color: ${props => props.theme.lightBgColors[1]};
  padding: 1px 5px;
  border-radius: 3px;
  cursor: pointer;
`

const status = ["init", "online", "offline"];

export const DataStoreListItem: React.FC<DataStoreListItemProps> = ({
  datastore,
  showGoToBtn = true,
}) => {
  const { me } = useMeState();

  return (
    <DataStoreItem>
      <DataStoreSize>
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="2"
            strokeDasharray="100, 100"
          />
        </svg>
        <div>
          <p>
            <span>{`${Math.round(datastore?.size?.usedSize || 0)}/${Math.round(
              datastore.sizeInMB || 0
            )}`}</span>{" "}
            Mb
          </p>
          <p>{Math.round(datastore.size?.usedPercent || 0)}%</p>
        </div>
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${datastore.size?.usedPercent || 100}, 100`}
          />
        </svg>
      </DataStoreSize>
      <DataStoreInfo>
        <DataStoreItemHeader>
          <DataStoreItemTitle>
            <Link href={`/datastore/${datastore.id}`}>
              <span>
                {datastore.name}
              </span>
            </Link>
            {showGoToBtn && (
              <Link href={`/path?d=${datastore.id}`}>
                <button>Go to</button>
              </Link>
            )}
          </DataStoreItemTitle>
          <DataStoreOwner>
            <label>Owner: </label>
            <span>{datastore.owner?.userName}</span>
            <p>{datastore.owner?.id === me?.id && " (You)"}</p>
          </DataStoreOwner>
        </DataStoreItemHeader>
        <StatusSection status={status.indexOf(datastore.status)}>
          <div>
            status:
            <p>
              {datastore.status === "init"
                ? "Initializing"
                : datastore.status.charAt(0).toUpperCase() +
                datastore.status.slice(1)}
            </p>
          </div>
          {!datastore.userInitialized &&
            <Link href={`/datastore/${datastore.id}`}>
              <InitUserSection>User not initialized</InitUserSection>
            </Link>
          }
        </StatusSection>
        <DataStoreShared>
          <DataStoreSharedHeader>
            <div>Shared: </div>
          </DataStoreSharedHeader>
          <DataStoreSharedUsers>
            {datastore.sharedUsers.length ? (
              <ProfilePicturesStack
                users={datastore.sharedUsers.map(({ id, userName }) => ({
                  id: Number(id),
                  userName,
                }))}
              />
            ) : (
              <PlaceHolder style={{ marginLeft: 4 }}>Not shared</PlaceHolder>
            )}
          </DataStoreSharedUsers>
        </DataStoreShared>
      </DataStoreInfo>
    </DataStoreItem>
  );
};
