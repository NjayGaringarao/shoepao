import React, { type ReactNode, useState, useCallback, useEffect } from "react";
import { createContext, useContext } from "react";
import type { Conversation, Message } from "../types";
import { apiService } from "../services/api";

const DRAFT_CONVERSATION_ID = -1;

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  createNewConversation: () => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteConversation: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  loadConversations: () => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Load all conversations
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllConversations();
      setConversations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new conversation
  const createNewConversation = useCallback(async () => {
    setError(null);
    setLoading(false);
    const draftConversation: Conversation = {
      id: DRAFT_CONVERSATION_ID,
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isDraft: true,
    };
    setCurrentConversation(draftConversation);
    setMessages([]);
  }, []);

  // Select a conversation and load its messages
  const selectConversation = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const conversation = await apiService.getConversation(id);
      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversation"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message and get response
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentConversation) {
        setError("No conversation selected");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        let activeConversation = currentConversation;

        if (currentConversation.isDraft) {
          const createdConversation = await apiService.createConversation();
          activeConversation = createdConversation;
          setCurrentConversation(createdConversation);
        }

        const response = await apiService.sendMessage(
          activeConversation.id,
          content
        );

        // Update messages with both user and assistant messages
        setMessages((prev) => [
          ...prev,
          response.user_message,
          response.assistant_message,
        ]);

        // Update current conversation to refresh updated_at
        if (response.conversation_id === activeConversation.id) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, updated_at: new Date().toISOString() } : null
          );
        }

        // Reload conversations to update the list order
        await loadConversations();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setLoading(false);
      }
    },
    [currentConversation, loadConversations]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteConversation(id);

        // If deleted conversation was current, clear it
        if (currentConversation?.id === id) {
          setCurrentConversation(null);
          setMessages([]);
        }

        // Reload conversations list
        await loadConversations();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete conversation"
        );
      } finally {
        setLoading(false);
      }
    },
    [currentConversation, loadConversations]
  );

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: ChatContextType = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    searchQuery,
    createNewConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    setSearchQuery,
    loadConversations,
    clearError,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
