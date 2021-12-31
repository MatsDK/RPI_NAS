import styled from "styled-components";
import { Spinner } from "./Spinner";

export const Button = styled.button`
  background: transparent;
  border: 0;
  white-space: nowrap;
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
  white-space: nowrap;
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

interface LoadingProps {
  loading: boolean
}

const LoadingOverlayWrapper = styled.div`
  position: relative;

`
const Children = styled.div<LoadingProps>`
  width: 100%;
  height: 100%;
  transition: opacity .15s ease-in-out;
  opacity: ${props => props.loading ? .3 : 1};
`

const Loader = styled.div<LoadingProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;

  transition: opacity .15s ease-in-out;
  opacity: ${props => props.loading ? 1 : 0};
  pointer-events: ${props => props.loading ? "all" : "none"};
`

interface LoadingOverlayProps {
  loading: boolean
}


export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, children }) => (
  <LoadingOverlayWrapper >
    <Children loading={loading}>
      {children}
    </Children>
    <Loader loading={loading}>
      <Spinner loading={loading} />
    </Loader>
  </LoadingOverlayWrapper>
);