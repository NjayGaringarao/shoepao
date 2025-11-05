export type Message = {
  id: number;
  content: string;
  role: "user" | "assistant" | "system";
  created_at: string;
};

export type Conversation = {
  id: number;
  messages: Message[];
  created_at: string;
  updated_at: string;
};

export type ChatResponse = {
  conversation_id: number;
  user_message: Message;
  assistant_message: Message;
};

export type ConversationListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Conversation[];
};
