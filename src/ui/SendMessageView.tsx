import { memo, SyntheticEvent, useRef, useState } from "react";
import styled from "styled-components";

export interface SendMessageViewProps {
  onSend: (msg: string) => void;
}
const SendMessageView = ({ onSend }: SendMessageViewProps) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = (e: SyntheticEvent<unknown>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!message) return;
    onSend(message);

    setMessage("");
    inputRef.current?.focus();
  };
  return (
    <InputContainer onSubmit={handleSend}>
      <Input
        ref={inputRef}
        placeholder="Text message"
        value={message}
        onChange={({ target }) => setMessage(target.value.slice(0, 300))}
      />
      <Button onClick={handleSend}>Send</Button>
    </InputContainer>
  );
};
export default memo(SendMessageView);

const InputContainer = styled.form`
  align-items: center;
  background-color: white;
  bottom: 0;
  display: flex;
  gap: 4px;
  height: 72px;
  left: 0;
  padding: 12px;
  position: fixed;
  right: 0;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  color: black;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid gray;
`;

const Button = styled.button`
  background-color: #007aff;
  color: white;
  padding: 12px;
  border-radius: 16px;
  outline: none;
  border: none;
  :active {
    background-color: #009aff;
  }
`;
