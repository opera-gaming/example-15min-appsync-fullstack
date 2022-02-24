import { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";

import { messagesByDate } from "./graphql/queries";

import { v4 as uuid } from "uuid";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import {
  MessagesByDateQuery,
  Message,
  MessagesByDateQueryVariables,
  ModelSortDirection,
  MessageType,
} from "./API";
import MessageView, { MessagesContainer } from "./ui/MessageView";
import styled from "styled-components";

Amplify.configure(config);

// This is a unique identifier we create on load. It helps us identify
// if we sent a request or not.
const CLIENT_ID = uuid();
const MAX_MESSAGES = 50;

const fetchMessagesRequest = async () => {
  try {
    const vars: MessagesByDateQueryVariables = {
      type: MessageType.MESSAGE,
      // Grab only 50 messages.
      limit: MAX_MESSAGES,
      // Sort them so we get the 50 latest message.
      sortDirection: ModelSortDirection.DESC,
    };
    // Do this actual request.
    const messagesResult = (await API.graphql(
      graphqlOperation(messagesByDate, vars)
    )) as GraphQLResult<MessagesByDateQuery>;
    console.log("fetched messages:", messagesResult.data);

    // Get the messages from the request result. Fallback to empty array.
    const messages = messagesResult.data?.messagesByDate?.items ?? [];
    // The messages are now in the reverse order. Let's fix that!
    messages.reverse();

    return messages;
  } catch (error) {
    console.log("fetch messages error:", error);
  }
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  // Fetch initial messages
  useEffect(() => {
    (async () => {
      const messages = await fetchMessagesRequest();
      if (!messages) return;
      setMessages(
        // Graphql can return null if there is something corrupt about a message.
        // This can happen if the schema has changed but the database hasn't been migrated.
        messages.filter(
          <T extends any>(msg: T | null | undefined): msg is T => !!msg
        )
      );
    })();
  }, []);

  return (
    <Container>
      <MessagesContainer>
        {messages.map(({ id, message, createdAt, clientId, name }) => (
          <MessageView
            key={id}
            me={CLIENT_ID === clientId}
            message={message}
            dateTime={createdAt}
            sender={name}
          />
        ))}
      </MessagesContainer>
    </Container>
  );
}

export default App;

const Container = styled.div`
  padding: 12px;
  padding-bottom: 68px;
`;
