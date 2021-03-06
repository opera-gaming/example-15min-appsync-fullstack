import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";

import Observable from "zen-observable-ts";

import { messagesByDate } from "./graphql/queries";
import { createMessage } from "./graphql/mutations";
import { onCreateMessage } from "./graphql/subscriptions";

import { v4 as uuid } from "uuid";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import {
  MessagesByDateQuery,
  CreateMessageInput,
  Message,
  OnCreateMessageSubscription,
  MessagesByDateQueryVariables,
  ModelSortDirection,
  MessageType,
  CreateMessageMutation,
} from "./API";
import WhatsYourName from "./ui/WhatsYourName";
import MessageView, { MessagesContainer } from "./ui/MessageView";
import styled from "styled-components";
import SendMessageView from "./ui/SendMessageView";

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

const sendMessageRequest = async (input: CreateMessageInput) => {
  try {
    (await API.graphql(
      graphqlOperation(createMessage, { input })
    )) as GraphQLResult<CreateMessageMutation>;
    console.info("Sent message: ", input.message);
  } catch (error) {
    console.error("Send message error: ", error);
  }
};

function App() {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = useCallback(
    (message: string) => {
      sendMessageRequest({
        type: MessageType.MESSAGE,
        name,
        message,
        clientId: CLIENT_ID,
      });
    },
    [name]
  );

  useEffect(() => {
    if (!name) return;
    if (!messages) return;

    document.documentElement?.scrollIntoView({
      behavior: "auto",
      block: "end",
      inline: "nearest",
    });
  }, [messages, name]);

  // Fetch initial
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

  useEffect(() => {
    // Subscribe to incoming messages.
    const subscription = (
      API.graphql(graphqlOperation(onCreateMessage)) as Observable<{
        value?: { data?: OnCreateMessageSubscription };
      }>
    ).subscribe({
      // We've received a new message!
      next: ({ value }) => {
        console.info("Received: ", value);
        // Get the message from the event.
        const message = value?.data?.onCreateMessage;
        // Just like when we fetch the full list, broken messages can be null.
        // Let's ignore those
        if (!message) return;
        setMessages((msgs) =>
          // Append the message to the list
          [...msgs, message]
            // Only keep 50 messages. The 50 latest specifically
            .slice(-MAX_MESSAGES)
        );
      },
    });

    // Unsubscribe when the component is unmounted
    return () => subscription.unsubscribe();
  }, []);

  // Get name if not set
  if (!name) {
    return <WhatsYourName onConfirm={setName} />;
  }

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
      <SendMessageView onSend={handleSend} />
    </Container>
  );
}

export default App;

const Container = styled.div`
  padding: 12px;
  padding-bottom: 68px;
`;
