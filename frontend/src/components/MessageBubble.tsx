import React from "react";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import type { Message } from "../types";
import { Person, SmartToy } from "@mui/icons-material";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box
      display="flex"
      justifyContent={isUser ? "flex-end" : "flex-start"}
      mb={2}
      px={2}
    >
      <Box
        display="flex"
        flexDirection={isUser ? "row-reverse" : "row"}
        alignItems="flex-start"
        gap={1}
        maxWidth="70%"
      >
        <Avatar
          sx={{
            bgcolor: isUser ? "primary.main" : "secondary.main",
            width: 32,
            height: 32,
          }}
        >
          {isUser ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
        </Avatar>
        <Box
          display="flex"
          flexDirection="column"
          alignItems={isUser ? "flex-end" : "flex-start"}
        >
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              bgcolor: isUser ? "primary.main" : "grey.100",
              color: isUser ? "white" : "text.primary",
              borderRadius: 2,
              maxWidth: "100%",
              wordBreak: "break-word",
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {message.content}
            </Typography>
          </Paper>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, px: 1 }}
          >
            {formatTime(message.created_at)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBubble;
