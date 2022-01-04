import React, { useEffect, useRef, useState } from "react";
import { useDropdown } from "src/hooks/useDropdown";
import styled from "styled-components";
import Icon from "./Icon";
import { Scrollbar } from "./Scrollbar";

interface SelectProps {
  data: any[];
  label: string;
  setValue: React.Dispatch<any>;
  renderItem: (item: any, idx: number, onClick: () => void) => JSX.Element;
  uniqueKey: string
  selectedLabelKey: string
  width?: number
}

const Wrapper = styled.div`
  position: relative;
`

type ContainerProps = { showDropDown: boolean, width: number }
const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${props => props.width}px;
  height: 40px;
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  border-radius: 7px;
  border-bottom-left-radius: ${props => props.showDropDown ? 0 : 7}px;
  border-bottom-right-radius: ${props => props.showDropDown ? 0 : 7}px;
  border: 1px solid ${props => props.theme.lightBgColors[1]};
  background: ${props => props.theme.lightBgColors[0]};
  transition: border-radius .15s ease-in-out;
`

const Label = styled.span`
  color: ${props => props.theme.textColors[1]};
  padding: 0 15px;
`

const DropDownButton = styled.div`
  height: calc(100% - 10px);
  width: 40px;
  border-left: 1px solid ${props => props.theme.lightBgColors[2]};
  padding:  5px;
  display: grid;
  place-items: center;
`

const DropDown = styled.div`
  ${Scrollbar}

  position: absolute;
  width: 100%;
  padding: 0;
  margin-top: -1px;
  background: ${props => props.theme.lightBgColors[0]};
  border: 1px solid ${props => props.theme.lightBgColors[1]};
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 200;
`

const SelectedValue = styled.span`
  padding: 0 15px;
  color: ${props => props.theme.textColors[0]};
`

export const Select: React.FC<SelectProps> = ({
  data,
  label,
  setValue,
  renderItem,
  uniqueKey,
  selectedLabelKey,
  width = 300
}) => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [selected, setSelected] = useState<any>(null)

  const dropDownRef = useRef()
  useDropdown(dropDownRef, () => showDropDown && setShowDropDown(false))

  useEffect(() => {
    const newVal = data.find((item) => item[uniqueKey] == selected)
    if (newVal) setValue(newVal)
    setShowDropDown(false)
  }, [selected])

  const selectedItem = selected && data.find((item) => item[uniqueKey] == selected)

  return <Wrapper>
    <Container showDropDown={showDropDown} onClick={() => setShowDropDown(s => !s)} width={width}>
      {selectedItem ? <SelectedValue>{selectedItem[selectedLabelKey]}</SelectedValue> :
        <Label>{label}</Label>
      }
      <DropDownButton >
        <div style={{ transform: `rotate(${showDropDown ? 270 : 90}deg)` }}>
          <Icon
            name={"folderArrow"}
            color={{ idx: 2, propName: "textColors" }}
            height={16}
            width={16}
          />
        </div>
      </DropDownButton>
    </Container>
    {showDropDown && <DropDown ref={dropDownRef as any}>
      {data.map((item, idx) => {
        return renderItem(item, idx, () => {
          setSelected(() => item[uniqueKey])
        })
      })}
    </DropDown>}
  </Wrapper>
};
