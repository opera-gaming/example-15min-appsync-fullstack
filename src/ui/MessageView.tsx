import { memo } from "react";
import styled, { css } from "styled-components";

export interface MessageViewProps {
  dateTime: string;
  me: boolean;
  message: string;
  sender: string;
}
const MessageView = ({ dateTime, me, message, sender }: MessageViewProps) => (
  <Container $me={me}>
    <Author $me={me}>{sender}</Author>
    <Bubble $me={me}>{message}</Bubble>
    <DateTime $me={me}>{new Date(dateTime).toLocaleString()}</DateTime>
  </Container>
);
export default memo(MessageView);

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Container = styled.div<{ $me: boolean }>`
  color: #b5b5ba;
  display: flex;
  flex-direction: column;
  align-items: ${({ $me }) => ($me ? "flex-end" : "flex-start")};
  ${({ $me }) => ($me ? "margin-right: 6px" : "margin-left: 6px")};
`;

const Bubble = styled.div<{ $me: boolean }>`
  background-color: ${({ $me }) => ($me ? "#1287fe" : "#e5e5ea")};
  border-radius: 12px;
  color: ${({ $me }) => ($me ? "white" : "black")};
  max-width: 80%;
  padding: 12px;
  position: relative;
  ${({ $me }) => ($me ? rightPointer : leftPointer)};
`;

const Author = styled.div<{ $me: boolean }>`
  padding: 3px;
  font-size: calc(4px + 2vmin);
`;

const DateTime = styled.div<{ $me: boolean }>`
  padding: 3px;
  font-size: calc(4px + 2vmin);
`;

const leftPointer = css`
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-right-color: #00fbff;
    border-right-color: #e5e5ea;
    border-left: 0;
    border-bottom: 0;
    margin-top: -6px;
    margin-left: -12px;
  }
`;

const rightPointer = css`
  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-left-color: #1287fe;
    border-right: 0;
    border-bottom: 0;
    margin-top: -6px;
    margin-right: -12px;
  }
`;
