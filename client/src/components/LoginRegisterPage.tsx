import React from "react";
import styled from "styled-components";

interface LoginRegisterPageProps { }

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: ${(props) => props.theme.textColors[0]};
`;

export const Error = styled.span`
  color: ${(props) => props.theme.statusColors[2]};
  font-size: 15px;
  margin: -2px 0 10px 2px;
  height: 10px;
`;

export const SubmitButton = styled.button`
  width: 100px;
  background: ${(props) => props.theme.bgColors[1]};
  border: 0;
  border-radius: 3px;
  color: ${(props) => props.theme.textColors[3]};
  font-size: 16px;
  cursor: pointer;
  padding: 5px 9px 5px 10px;
  border: 0;
  transition: box-shadow 0.15s ease-in-out;
  text-align: center;
  font-weight: 700;
  margin-top: 25px;

  :hover {
    box-shadow: 4px 4px 7px 0 #00000030;
  }
`;

export const PageLink = styled.div`
  text-decoration: underline;
  color: ${(props) => props.theme.textColors[1]};
  cursor: pointer;
  margin-top: 2px;
  font-weight: 600;
  transition: 0.1s ease-in-out;

  :hover {
    color: ${(props) => props.theme.textColors[0]};
  }
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColors[0]};
  width: 100vw;
  height: 100vh;

  > div,
  > form {
    width: 650px;
    height: 2000px;
    position: absolute;
    top: 0;
  }
`;

const Bg = styled.div`
  z-index: 99;
  transform: skewX(5deg);
  background-color: ${(props) => props.theme.lightBgColors[0]};
  box-shadow: 2px 2px 10px 2px #00000013;
`;

const Bg2 = styled.div`
  box-shadow: 2px 2px 10px 2px #00000013;
  z-index: 98;
  width: 560px !important;
  transform: skewX(-7deg);
  background-color: ${(props) => props.theme.lightBgColors[0]};
`;

export const LoginRegisterPage: React.FC<LoginRegisterPageProps> = ({
  children,
}) => {
  return (
    <Container>
      <Bg />
      <Bg2 />
      {children}
    </Container>
  );
};
