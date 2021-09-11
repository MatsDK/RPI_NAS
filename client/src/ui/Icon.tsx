import React from "react";
import { iconPaths } from "src/utils/icons";
import styled from "styled-components";

interface Props {
  name: keyof typeof iconPaths;
  color: { propName: string; idx: number };
  width: number;
  height: number;
  viewPort?: number;
}

interface svgProps {
  fillColor: { propName: string; idx: number };
}

const Svg = styled.svg<svgProps>`
  path {
    fill: ${(props) =>
      props.theme[props.fillColor.propName][props.fillColor.idx]};
  }

  display: grid;
`;

const Icon: React.FC<Props> = ({ name, color, width, height, viewPort }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewPort || width} ${viewPort || height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      fillColor={color}
    >
      <path d={iconPaths[name]} />
    </Svg>
  );
};

export default Icon;
