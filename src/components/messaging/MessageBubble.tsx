
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = false
}: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm', { locale: fr });
    } else if (isYesterday(timestamp)) {
      return `Hier ${format(timestamp, 'HH:mm', { locale: fr })}`;
    } else {
      return format(timestamp, 'dd/MM/yyyy HH:mm', { locale: fr });
    }
  };

  const messageTime = message.createdAt.toDate();

  return (
    <div
      className={cn(
        'flex gap-2 mb-4',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {message.senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Spacer for alignment when no avatar */}
      {!showAvatar && !isOwn && <div className="w-8 flex-shrink-0" />}

      {/* Message Content */}
      <div
        className={cn(
          'flex flex-col max-w-[75%] md:max-w-[60%]',
          isOwn ? 'items-end' : 'items-start'
        )}
      >
        {/* Sender Name (only for group chats and not own messages) */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1 px-3">
            {message.senderName}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2 break-words',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-accent text-accent-foreground rounded-bl-sm'
          )}
        >
          {/* Text Message */}
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Image Message */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="space-y-2">
              <img
                src={message.mediaUrl}
                alt="Image"
                className="rounded-lg max-w-full h-auto"
              />
              {message.content && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          )}

          {/* File Message */}
          {message.type === 'file' && message.mediaUrl && (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{message.content}</p>
                <a
                  href={message.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                >
                  Télécharger
                </a>
              </div>
            </div>
          )}

          {/* System Message */}
          {message.type === 'system' && (
            <p className="text-xs italic">{message.content}</p>
          )}
        </div>

        {/* Timestamp and Status */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1 px-3',
            isOwn ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {showTimestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTime(messageTime)}
            </span>
          )}

          {/* Read Status (only for own messages) */}
          {isOwn && (
            <div className="text-muted-foreground">
              {message.status === 'sending' && (
                <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              {message.status === 'sent' && <Check className="h-3 w-3" />}
              {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {message.status === 'read' && (
                <CheckCheck className="h-3 w-3 text-primary" />
              )}
              {message.status === 'failed' && (
                <span className="text-xs text-destructive">!</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}