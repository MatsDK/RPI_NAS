import React, { useState } from "react";
import styled from "styled-components";

interface InputProps {
  label: string;
  value: any;
  setValue: any;
}

type Props = { moved: boolean };

const Input = styled.input`
  color: ${(props) => props.theme.textColors[3]};
  background-color: transparent;
  padding: 3px 4px;
  font-size: 16px;
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.textColors[2]};
  margin-bottom: 10px;
  outline: 0;
  padding-top: 7px;
`;

const Label = styled.div<Props>`
  position: absolute;
  margin-left: 3px;
  transition: 0.1s ease-in-out;
  color: ${(props) =>
    props.moved ? props.theme.textColors[2] : props.theme.textColors[3]};
  top: ${(props) => (props.moved ? -12 : 5)}px;
  font-size: ${(props) => (props.moved ? 14 : 17)}px;
`;

export const LabelInput: React.FC<InputProps> = ({
  label,
  value,
  setValue,
}) => {
  const [moveLabel, setMoveLabel] = useState(!!value.trim());

  return (
    <div style={{ position: "relative" }}>
      <Label moved={moveLabel}>{label}</Label>
      <Input
        onFocus={() => setMoveLabel(true)}
        onBlur={() => !value.trim() && setMoveLabel(false)}
        type="text"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};
