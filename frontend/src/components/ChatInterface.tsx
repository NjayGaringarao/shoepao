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
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1,
          p: { xs: 4, md: 6 },
          borderRadius: "0.5rem",
          backgroundColor: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0px 25px 45px rgba(15, 23, 42, 0.18)",
        }}
      >
        <Box>
          <img src="/logo.png" alt="Shoepao" width={200} height={200} />
        </Box>
        <Typography variant="h2" color="text.primary">
          Welcome to Shoepao Chatbot!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Select a conversation or start a new one. Your messages will appear
          here once you pick a chat.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      sx={{
        gap: 2,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor:
            messages.length > 0
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.7)",

          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0px 25px 45px rgba(15, 23, 42, 0.18)",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: "3rem",
                  }}
                >
                  <LoadingIndicator size={64} />
                  <Typography variant="h4" color="text.secondary">
                    Starting your conversation…
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h4" sx={{ mt: "3rem" }}>
                  No messages yet. Start the conversation!
                </Typography>
              )}
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && (
                <Box display="flex" justifyContent="flex-start">
                  <LoadingIndicator size={24} />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
        <MessageInput onSend={sendMessage} disabled={loading} />
      </Box>
    </Box>
  );
};

export default ChatInterface;
