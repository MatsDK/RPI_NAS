import styled from "styled-components";

export interface ArrowButtonProps {
  active: boolean;
}

export const ArrowButton = styled.div<ArrowButtonProps>`
  background-color: transparent;
  cursor: pointer;

  display: grid;
  place-items: center;

  transform: rotate(${(props) => props.active ? 90 : 0}deg);
`;
