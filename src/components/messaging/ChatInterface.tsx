
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversation } from '@/hooks/useConversation';
import { Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  conversationId: string;
  onBack?: () => void;
}

export function ChatInterface({ conversationId, onBack }: ChatInterfaceProps) {
  const {
    messages,
    conversation,
    loading,
    error,
    hasMore,
    sendMessage,
    loadMore,
    setTyping,
    typingUsers
  } = useConversation(conversationId);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    try {
      await setTyping(isTyping);
    } catch (err) {
      console.error('Error updating typing status:', err);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-destructive mb-2">Erreur de chargement</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading && !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p className="text-muted-foreground">Conversation introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader
        conversation={conversation}
        onBack={onBack}
        typingUsers={typingUsers}
      />

      {/* Messages */}
      <MessageList
        messages={messages}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onTyping={handleTyping}
        disabled={loading}
      />
    </div>
  );
}