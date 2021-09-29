import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Icon from "./Icon";

interface SelectProps {
  selectedIdx?: number;
  data: any[];
  label: string;
  setValue: React.Dispatch<any>;
  propName?: string;
}

const SelectWrapper = styled.div`
  height: 39px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const SelectContainer = styled.div`
  display: flex;
  height: 29px;
  min-width: 85px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.textColors[2]};
  cursor: pointer;
  padding: 0 3px;
`;

const Label = styled.span`
  color: ${(props) => props.theme.textColors[3]};
`;

const SelectDropDown = styled.div`
  margin-top: -4px;
  position: absolute;
  top: 100%;
  background-color: ${(props) => props.theme.bgColors[0]};
  z-index: 200;
  width: 100%;
  padding: 2px 3px;
  box-shadow: 3px 3px 10px 5px #0000007a;

  p:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.bgColors[2]};
  }
`;

export const Select: React.FC<SelectProps> = ({
  selectedIdx,
  data,
  label,
  setValue,
  propName,
}) => {
  const [selected, setSelectedIdx] = useState(
    selectedIdx != null ? selectedIdx : null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    selected != null && setValue(data[selected]);
  }, [selected]);

  return (
    <SelectWrapper>
      <SelectContainer onClick={() => setDropdownOpen((s) => !s)}>
        {selected != null ? (
          <Label>{propName ? data[selected][propName] : data[selected]}</Label>
        ) : (
          <Label>{label}</Label>
        )}
        <div
          style={{
            marginLeft: 10,
            transform: !dropdownOpen ? "rotate(90deg)" : "rotate(-90deg)",
          }}
        >
          <Icon
            name={"folderArrow"}
            color={{ idx: 2, propName: "textColors" }}
            height={16}
            width={16}
          />
        </div>
      </SelectContainer>
      {dropdownOpen && (
        <SelectDropDown>
          {data.map((v, idx) => {
            return (
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  idx != selected && setSelectedIdx(idx);
                  setDropdownOpen(false);
                }}
              >
                {propName ? v[propName] : v}
              </p>
            );
          })}
        </SelectDropDown>
      )}
    </SelectWrapper>
  );
};