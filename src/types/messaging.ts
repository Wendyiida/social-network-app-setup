
import { Timestamp } from 'firebase/firestore';

// Message types
export type MessageType = 'text' | 'image' | 'file' | 'system';
export type ConversationType = 'direct' | 'group';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// Core messaging interfaces
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  status: MessageStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readBy: string[]; // Array of user IDs who have read the message
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For group chats
  avatarUrl?: string; // For group chats
  participants: string[]; // Array of user IDs
  participantDetails: ParticipantDetail[];
  lastMessage?: LastMessage;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface ParticipantDetail {
  userId: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  joinedAt: Timestamp;
  lastRead?: Timestamp;
  isTyping?: boolean;
}

export interface LastMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  createdAt: Timestamp;
  unreadCount: number;
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: Timestamp;
  lastRead: Timestamp;
  notificationsEnabled: boolean;
  isPinned: boolean;
  isMuted: boolean;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
  timestamp: Timestamp;
}

// UI-specific types
export interface ConversationListItem {
  conversation: Conversation;
  unreadCount: number;
  lastMessage?: LastMessage;
  otherParticipant?: ParticipantDetail; // For direct messages
}

export interface MessageGroup {
  date: string;
  messages: Message[];
}

// Hook return types
export interface UseMessagingReturn {
  conversations: ConversationListItem[];
  loading: boolean;
  error: Error | null;
  createConversation: (participantIds: string[], type: ConversationType, name?: string) => Promise<string>;
  deleteConversation: (conversationId: string) => Promise<void>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  pinConversation: (conversationId: string, isPinned: boolean) => Promise<void>;
  muteConversation: (conversationId: string, isMuted: boolean) => Promise<void>;
}

export interface UseConversationReturn {
  messages: Message[];
  conversation: Conversation | null;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  sendMessage: (content: string, type?: MessageType, mediaUrl?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  setTyping: (isTyping: boolean) => Promise<void>;
  typingUsers: ParticipantDetail[];
}

// Firestore data types (for creating documents)
export type MessageInput = Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'readBy' | 'status'>;
export type ConversationInput = Omit<Conversation, 'id' | 'createdAt' | 'updatedAt' | 'lastMessage'>;
export type ParticipantInput = Omit<ConversationParticipant, 'id' | 'joinedAt' | 'lastRead'>;