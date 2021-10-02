import { css } from "styled-components";

export const Scrollbar = css`
  scrollbar-color: ${(props) => props.theme.lightBgColors[2]} white;
  scrollbar-width: thin;

  ::-webkit-scrollbar {
    width: 6px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.lightBgColors[2]};
    border-radius: 2px;
  }
`;
