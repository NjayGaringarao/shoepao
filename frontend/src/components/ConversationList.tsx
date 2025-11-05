import React, { useMemo } from "react";
import {
  Box,
  Drawer,
  List,
  TextField,
  Button,
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useChat } from "../context/ChatContext";
import ConversationItem from "./ConversationItem";
import LoadingIndicator from "./LoadingIndicator";

const DRAWER_WIDTH = 320;

interface ConversationListProps {
  open?: boolean;
  onClose?: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    conversations,
    currentConversation,
    searchQuery,
    setSearchQuery,
    createNewConversation,
    selectConversation,
    deleteConversation,
    loading,
  } = useChat();

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }

    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      if (conv.messages && conv.messages.length > 0) {
        return conv.messages.some((msg) =>
          msg.content.toLowerCase().includes(query)
        );
      }
      return false;
    });
  }, [conversations, searchQuery]);

  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort((a, b) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }, [filteredConversations]);

  const content = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={createNewConversation}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          New Chat
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {loading && conversations.length === 0 ? (
          <LoadingIndicator />
        ) : sortedConversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {sortedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={currentConversation?.id === conversation.id}
                onSelect={selectConversation}
                onDelete={deleteConversation}
              />
            ))}
          </List>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        height: "100%",
      }}
    >
      {content}
    </Box>
  );
};

export default ConversationList;
