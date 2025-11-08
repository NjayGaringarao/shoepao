import React, { useState } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import type { Conversation } from "../types";
import DeleteDialog from "./DeleteDialog";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(conversation.id);
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getPreview = () => {
    if (conversation.messages && conversation.messages.length > 0) {
      const lastMessage =
        conversation.messages[conversation.messages.length - 1];
      return (
        lastMessage.content.substring(0, 50) +
        (lastMessage.content.length > 50 ? "..." : "")
      );
    }
    return "No messages yet";
  };

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton edge="end" onClick={handleDelete} size="small">
            <Delete fontSize="small" />
          </IconButton>
        }
        sx={{
          bgcolor: isSelected ? "rgba(255,255,255,0.7)" : "transparent",
          "&:hover": {
            bgcolor: "action.hover",
          },
          border: isSelected ? "1px solid #9b6e4b" : "none",
          borderLeft: isSelected ? "10px solid #9b6e4b" : "none",
        }}
      >
        <ListItemButton onClick={() => onSelect(conversation.id)}>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getPreview()}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {formatDate(conversation.updated_at)}
                </Typography>
              }
            />
          </Box>
        </ListItemButton>
      </ListItem>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ConversationItem;
