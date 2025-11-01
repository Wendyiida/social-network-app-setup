
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from './MessageBubble';
import { Message } from '@/types/messaging';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function MessageList({
  messages,
  loading = false,
  hasMore = false,
  onLoadMore
}: MessageListProps) {
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(message.createdAt.toDate(), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  // Scroll to bottom on first load or new message
  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'instant' });
        isFirstLoad.current = false;
      } else {
        // Only auto-scroll if user is near bottom
        const scrollArea = scrollAreaRef.current;
        if (scrollArea) {
          const { scrollTop, scrollHeight, clientHeight } = scrollArea;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          
          if (isNearBottom) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  }, [messages.length]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(date, today)) {
      return "Aujourd'hui";
    } else if (isSameDay(date, yesterday)) {
      return 'Hier';
    } else {
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <p className="text-muted-foreground mb-2">Aucun message</p>
          <p className="text-sm text-muted-foreground">
            Envoyez un message pour démarrer la conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-2" />
            )}
            Charger plus
          </Button>
        </div>
      )}

      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex justify-center my-4">
            <div className="bg-accent px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-accent-foreground">
                {formatDateHeader(date)}
              </span>
            </div>
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message, index) => {
            const isOwn = message.senderId === user?.uid;
            const prevMessage = dateMessages[index - 1];
            const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
            const showTimestamp = index === dateMessages.length - 1 || 
              dateMessages[index + 1]?.senderId !== message.senderId;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                showTimestamp={showTimestamp}
              />
            );
          })}
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </ScrollArea>
  );
}