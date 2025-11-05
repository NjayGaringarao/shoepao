import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useChat } from "../context/ChatContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import LoadingIndicator from "./LoadingIndicator";

const ChatInterface: React.FC = () => {
  const { currentConversation, messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentConversation) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        sx={{ bgcolor: "background.default" }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a conversation or start a new one
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="auto"
      width="100%"
      maxWidth={"85rem"}
      sx={{ bgcolor: "background.default" }}
      marginBottom={"3rem"}
    >
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={"100vh"}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        {loading && messages.length > 0 && (
          <Box display="flex" justifyContent="flex-start" mb={2} px={2}>
            <LoadingIndicator size={24} />
          </Box>
        )}
      </Box>
      <MessageInput onSend={sendMessage} disabled={loading} />
    </Box>
  );
};

export default ChatInterface;
