import React from "react";
import styled from "styled-components";

interface UpdateChangedProps {
  updated: Array<{ title: string; onUpdate: () => any; onCancel: () => any }>;
}

const Wrapper = styled.div`
  height: 50px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 0;

  > div {
    padding: 7px 25px;
    font-size: 17px;
    border-radius: 4px;
    background-color: ${(props) => props.theme.bgColors[1]};
    display: flex;
    box-shadow: 0 24px 54px rgb(0 0 0 / 50%), 0 4.5px 13.5px rgb(0 0 0 / 20%);

    > span {
      display: flex;
      color: ${(props) => props.theme.textColors[2]};

      > p {
        color: ${(props) => props.theme.textColors[3]};
        margin-left: 5px;
        font-weight: 600;
      }
    }

    button:first-of-type {
      margin-left: 15px;
      background-color: ${(props) => props.theme.lightBgColors[1]};
      color: ${(props) => props.theme.textColors[0]};
    }

    button:last-of-type {
      background-color: ${(props) => props.theme.statusColors[2]};
    }

    button {
      cursor: pointer;
      font-size: 17px;
      border: 0;
      margin: 0 5px;
      padding: 0 5px;
      color: ${(props) => props.theme.textColors[3]};
      border-radius: 2px;
    }
  }
`;

export const UpdateChanged: React.FC<UpdateChangedProps> = ({ updated }) => {
  const update = async () => {
    await Promise.all(updated.map(({ onUpdate }) => onUpdate()));
  };

  const cancel = async () => {
    await Promise.all(updated.map(({ onCancel }) => onCancel()));
  };

  return (
    <Wrapper>
      <div>
        <span>
          Update changes in <p>{updated.map(({ title }) => title)}</p>
        </span>
        <button onClick={update}>Update</button>
        <button onClick={cancel}>Cancel</button>
      </div>
    </Wrapper>
  );
};
