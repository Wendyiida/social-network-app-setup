
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ConversationListItem } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pin, Volume2, VolumeX } from 'lucide-react';

interface ConversationItemProps {
  conversation: ConversationListItem;
  isActive?: boolean;
  onClick: () => void;
  isPinned?: boolean;
  isMuted?: boolean;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  isPinned,
  isMuted
}: ConversationItemProps) {
  const { conversation: conv, unreadCount, lastMessage, otherParticipant } = conversation;

  // For direct messages, use other participant's info
  const displayName = conv.type === 'direct' 
    ? otherParticipant?.displayName || otherParticipant?.username || 'Unknown'
    : conv.name || 'Group Chat';

  const avatarUrl = conv.type === 'direct'
    ? otherParticipant?.avatarUrl
    : conv.avatarUrl;

  const avatarFallback = displayName.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 border-b border-border',
        isActive && 'bg-accent'
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={cn(
            'font-medium truncate',
            unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'
          )}>
            {displayName}
          </p>
          {isPinned && (
            <Pin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
          {isMuted && (
            <VolumeX className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {lastMessage && (
          <div className="flex items-center gap-2">
            <p className={cn(
              'text-sm truncate flex-1',
              unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {lastMessage.type === 'image' && '📷 Photo'}
              {lastMessage.type === 'file' && '📎 Fichier'}
              {lastMessage.type === 'system' && lastMessage.content}
              {lastMessage.type === 'text' && lastMessage.content}
            </p>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatDistanceToNow(lastMessage.createdAt.toDate(), {
                addSuffix: false,
                locale: fr
              })}
            </span>
          </div>
        )}

        {!lastMessage && (
          <p className="text-sm text-muted-foreground">Aucun message</p>
        )}
      </div>
    </div>
  );
}