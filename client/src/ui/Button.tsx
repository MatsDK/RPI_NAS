import styled from "styled-components";

export const Button = styled.button`
  background: transparent;
  border: 0;
  color: ${(props) => props.theme.textColors[1]};
  font-size: 16px;
  cursor: pointer;
  padding: 4px 9px 4px 10px;
  border: 0;
  transition: color 0.15s ease-in-out;

  :hover {
    color: ${(props) => props.theme.textColors[0]};
  }
`;

export const LightButton = styled.button`
  background: transparent;
  border: 0;
  color: ${(props) => props.theme.textColors[2]};
  font-size: 16px;
  cursor: pointer;
  padding: 4px 9px 4px 10px;
  border: 0;
  transition: color 0.15s ease-in-out;

  :hover {
    color: ${(props) => props.theme.textColors[3]};
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
  transition: box-shadow 0.15s ease-in-out;

  :hover {
    box-shadow: 4px 4px 7px 0 #00000030;
  }
`;

interface Props {
  condition: boolean;
}

export const ConditionButton: React.FC<Props> = ({ children, condition }) => (
  <div
    style={{
      transition: ".1s ease-in-out",
      opacity: condition ? 1 : 0.7,
      pointerEvents: condition ? "all" : "none",
    }}
  >
    {children}
  </div>
);

export const LightBgButton = styled.button`
  background-color: ${(props) => props.theme.lightBgColors[2]};
  cursor: pointer;
  border: 0;
  outline: none;
  font-size: 18px;
  color: ${(props) => props.theme.textColors[0]};
  font-weight: 500;
  border-radius: 3px;
  padding: 3px 13px;
  width: fit-content;
  transition: 0.1s ease-in-out;

  :hover {
    background-color: ${(props) => props.theme.lightBgColors[1]};
  }
`;
