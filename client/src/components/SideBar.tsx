import Link from "next/link";
import Icon from "src/ui/Icon";
import React from "react";
import styled from "styled-components";

const SideBar = styled.div`
  height: 100%;
  width: 70px;
  background-color: ${(props) => props.theme.bgColors[0]};
  border-top: 2px solid ${(props) => props.theme.bgColors[2]};
  display: flex;
  flex-direction: column;
`;

const SideBarItem = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  height: 50px;
  cursor: pointer;

  :hover > div {
    left: 75px;
    opacity: 1;
  }
`;

const SideBarItemText = styled.div`
  position: absolute;
  pointer-events: none;
  left: 100px;
  opacity: 0;
  background-color: ${(props) => props.theme.bgColors[0]};
  padding: 2px 14px;
  box-shadow: 2px 2px 5px 2px #00000063;
  border-radius: 4px;
  transition: 0.14s ease-in-out;

  span {
    color: ${(props) => props.theme.textColors[3]};
    font-size: 17px;
  }
`;

const sideBar = () => {
  return (
    <SideBar>
      <Link href={"/"}>
        <SideBarItem>
          <span style={{ marginRight: 5 }}>
            <Icon
              name="folderIcon"
              color={{ propName: "lightBgColors", idx: 1 }}
              height={30}
              width={45}
              viewPort={27}
            />
          </span>
          <SideBarItemText>
            <span>Files</span>
          </SideBarItemText>
        </SideBarItem>
      </Link>
      <Link href={"/datastores"}>
        <SideBarItem>
          <span style={{ marginRight: 5 }}>
            <Icon
              name="dataStoreIcon"
              color={{ propName: "lightBgColors", idx: 1 }}
              height={30}
              width={45}
              viewPort={27}
            />
          </span>
          <SideBarItemText>
            <span>DataStores</span>
          </SideBarItemText>
        </SideBarItem>
      </Link>
      <Link href={"/friends"}>
        <SideBarItem>
          <span style={{ marginRight: 5 }}>
            <Icon
              name="people"
              color={{ propName: "lightBgColors", idx: 1 }}
              height={30}
              width={45}
              viewPort={27}
            />
          </span>
          <SideBarItemText>
            <span>Friends</span>
          </SideBarItemText>
        </SideBarItem>
      </Link>
    </SideBar>
  );
};

export default sideBar;
