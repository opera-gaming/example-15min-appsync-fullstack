import { SyntheticEvent, useCallback, useState } from "react";
import styled from "styled-components";
import GitHubIcon from "./GithubIcon";
import OperaIcon from "./OperaIcon";

export interface WhatsYourNameProps {
  onConfirm: (name: string) => void;
}
const WhatsYourName = ({ onConfirm }: WhatsYourNameProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: SyntheticEvent<unknown>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name) return;
    onConfirm(name);
  };
  return (
    <Container onSubmit={handleSubmit}>
      What's your name?
      <Input
        required
        placeholder="Tomas Ralf!"
        value={name}
        onChange={useCallback(
          ({ target: { value } }) => setName(value.slice(0, 30)),
          []
        )}
      />
      <Button onClick={handleSubmit}>Next!</Button>
      <div />
      <Extra href="https://github.com/opera-gaming/example-15min-appsync-fullstack">
        <OperaIcon />
        Check this project out on GitHub!
        <GitHubIcon />
      </Extra>
      <div />
      <img src="/meow.jpg" alt="meow?" />
    </Container>
  );
};
export default WhatsYourName;

const Container = styled.form`
  color: black;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  padding: 12px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 4px;
  outline: none;
  border: 1px solid #b5b5ba;
`;

const Button = styled.button`
  background-color: #007aff;
  color: white;
  padding: 12px 36px;
  border-radius: 8px;
  outline: none;
  border: none;
  :active {
    background-color: #009aff;
  }
`;

const Extra = styled.a`
  display: flex;
  gap: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #ff1b2d;
  text-decoration: none;
  font-weight: 500;
  :hover {
    color: #fa1e4e;
  }
`;
