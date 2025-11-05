import axios from "axios";
import type {
  Conversation,
  ChatResponse,
  ConversationListResponse,
} from "../types";

const API_BASE_URL = "http://localhost:8000/api";

// Remove the explicit type annotation - TypeScript will infer it
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message =
        error.response.data?.error ||
        error.response.data?.detail ||
        "An error occurred";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

export const apiService = {
  // Create a new conversation
  createConversation: async (): Promise<Conversation> => {
    const response = await api.post<Conversation>("/conversations/", {});
    return response.data;
  },

  // Get a specific conversation with messages
  getConversation: async (id: number): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/conversations/${id}/`);
    return response.data;
  },

  // Get all conversations
  getAllConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<ConversationListResponse>("/conversations/");
    return response.data.results;
  },

  // Send a message and get chatbot response
  sendMessage: async (
    conversationId: number,
    content: string
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(
      `/conversations/${conversationId}/chat/`,
      {
        content,
      }
    );
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (id: number): Promise<void> => {
    await api.delete(`/conversations/${id}/`);
  },
};

export default apiService;
