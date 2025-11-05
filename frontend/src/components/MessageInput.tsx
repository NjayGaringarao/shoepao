import React, { useState, type KeyboardEvent } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        gap: 1,
        alignItems: "flex-end",
        bottom: 0,
        position: "fixed",
        width: "100%",
        maxWidth: "85rem",
        zIndex: 1000,
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        variant="outlined"
        size="small"
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
      >
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
