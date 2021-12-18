import React, { useState } from "react";
import styled from "styled-components";

interface InputProps {
  label: string;
  value: any;
  setValue: any;
  type?: string;
}

type Props = { moved: boolean };

export const Input = styled.input`
  border: 1px solid ${(props) => props.theme.textColors[3]};
  max-width: 300px;
  padding: 8px 15px;
  font-size: 16px;
  outline: none;
  border-radius: 7px;
  color: ${(props) => props.theme.textColors[0]};
`;

export const Label = styled.label`
  margin-top: 15px;
  color: ${(props) => props.theme.textColors[0]};
  font-weight: 600;
  font-size: 18px;
`;

const LabelInputLabel = styled.div<Props>`
  position: absolute;
  margin-left: 3px;
  transition: 0.1s ease-in-out;
  color: ${(props) =>
    props.moved ? props.theme.textColors[2] : props.theme.textColors[3]};
  top: ${(props) => (props.moved ? -12 : 4)}px;
  font-size: ${(props) => (props.moved ? 14 : 17)}px;
  pointer-events: none;
`;

export const LabelInput: React.FC<InputProps> = ({
  label,
  value,
  setValue,
  type = "text",
}) => {
  const [moveLabel, setMoveLabel] = useState(!!value.trim());

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <LabelInputLabel moved={moveLabel}>{label}</LabelInputLabel>
      <Input
        onFocus={() => setMoveLabel(true)}
        onBlur={() => !value.trim() && setMoveLabel(false)}
        type={type}
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

interface InputComponentProps {
  label: string,
  type?: string
}

export const InputComponent: React.FC<InputComponentProps> = ({ label, type = "text" }) => {
  return <div>
    <label>{label}</label>
    <input type={type} />
  </div>
}