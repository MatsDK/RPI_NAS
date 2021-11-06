import { Datastore } from "generated/apolloComponents";
import { PlaceHolder } from "pages/friends";
import Link from "next/link";
import React from "react";
import { useMeState } from "src/hooks/useMeState";
import { ProfilePicture } from "src/ui/ProfilePicture";
import styled from "styled-components";
import { useRouter } from "next/router";

interface DataStoreListItemProps {
  dataStore: Datastore;
  setDataStoreId: React.Dispatch<React.SetStateAction<number>>;
  setShowShareDataStoreForm: React.Dispatch<React.SetStateAction<boolean>>;
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

const SharedUser = styled.div`
  position: relative;

  > span {
    position: absolute;
    background-color: ${(props) => props.theme.bgColors[1]};
    color: ${(props) => props.theme.textColors[3]};
    top: 40px;
    opacity: 0;
    transition: 0.1s ease-in;
    pointer-events: none;
    padding: 1px 6px;
    border-radius: 2px;
    display: flex;

    > p {
      margin-left: 5px;
    }
  }

  :hover > span {
    top: 30px;
    opacity: 1;
  }
`;

interface StatusSectionProps {
  status: number;
}

const StatusSection = styled.div<StatusSectionProps>`
  color: ${(props) => props.theme.textColors[2]};
  display: flex;

  p {
    margin-left: 4px;
    font-weight: 600;

    color: ${(props) => props.theme.statusColors[props.status]};
  }
`;

const status = ["init", "online", "offline"];

export const DataStoreListItem: React.FC<DataStoreListItemProps> = ({
  dataStore,
  setDataStoreId,
  setShowShareDataStoreForm,
  showGoToBtn = true,
}) => {
  const { me } = useMeState();
  const router = useRouter();

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
            <span>{`${Math.round(dataStore.size?.usedSize || 0)}/${Math.round(
              dataStore.sizeInMB || 0
            )}`}</span>{" "}
            Mb
          </p>
          <p>{Math.round(dataStore.size?.usedPercent || 0)}%</p>
        </div>
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeDasharray={`${dataStore.size?.usedPercent || 100}, 100`}
          />
        </svg>
      </DataStoreSize>
      <DataStoreInfo>
        <DataStoreItemHeader>
          <DataStoreItemTitle>
            <span onClick={() => router.push(`/datastore/${dataStore.id}`)}>
              {dataStore.name}
            </span>
            {showGoToBtn && (
              <Link href={`/path?d=${dataStore.id}`}>
                <button>Go to</button>
              </Link>
            )}
          </DataStoreItemTitle>
          <DataStoreOwner>
            <label>Owner: </label>
            <span>{dataStore.owner?.userName}</span>
            <p>{dataStore.owner?.id === me?.id && " (You)"}</p>
          </DataStoreOwner>
        </DataStoreItemHeader>
        <StatusSection status={status.indexOf(dataStore.status)}>
          status:
          <p>
            {dataStore.status === "init"
              ? "Initializing"
              : dataStore.status.charAt(0).toUpperCase() +
                dataStore.status.slice(1)}
          </p>
        </StatusSection>
        <DataStoreShared>
          <DataStoreSharedHeader>
            <div>Shared: </div>
          </DataStoreSharedHeader>
          <DataStoreSharedUsers>
            {dataStore.sharedUsers.length ? (
              dataStore.sharedUsers.map((sharedUser, idx) => {
                return (
                  <SharedUser key={idx}>
                    <ProfilePicture
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${sharedUser.id}`}
                    />
                    <span>
                      {sharedUser.userName}
                      <p>{sharedUser.id === me?.id && "(You)"}</p>
                    </span>
                  </SharedUser>
                );
              })
            ) : (
              <PlaceHolder style={{ marginLeft: 4 }}>Not shared</PlaceHolder>
            )}
          </DataStoreSharedUsers>
        </DataStoreShared>
      </DataStoreInfo>
    </DataStoreItem>
  );
};
