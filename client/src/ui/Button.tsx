import styled from "styled-components";

export const Button = styled.button`
  background: transparent;
  border: 0;
  color: ${(props) => props.theme.textColors[1]};
  font-size: 16px;
  cursor: pointer;
  padding: 4px 9px 4px 10px;
  border: 0;
  /* border-right: 1px solid ${(props) => props.theme.textColors[3]}; */
  transition: color 0.15s ease-in-out;

  :hover {
    color: ${(props) => props.theme.textColors[0]};
  }
`;

export const BgButton = styled.button`
  background: ${(props) => props.theme.bgColors[1]};
  border: 0;
  border-radius: 3px;
  color: ${(props) => props.theme.textColors[3]};
  font-size: 16px;
  cursor: pointer;
  padding: 5px 9px 5px 10px;
  border: 0;
  /* border-right: 1px solid ${(props) => props.theme.textColors[3]}; */
  transition: box-shadow 0.15s ease-in-out;

  :hover {
    box-shadow: 4px 4px 10px 0 #00000030;
  }
`;
