
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Conversation, ParticipantDetail } from '@/types/messaging';
import { ArrowLeft, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onInfo?: () => void;
  typingUsers?: ParticipantDetail[];
}

export function ChatHeader({
  conversation,
  onBack,
  onInfo,
  typingUsers = []
}: ChatHeaderProps) {
  const { user } = useAuth();

  // For direct messages, get the other participant
  const otherParticipant = conversation.type === 'direct'
    ? conversation.participantDetails.find(p => p.userId !== user?.uid)
    : null;

  const displayName = conversation.type === 'direct'
    ? otherParticipant?.displayName || otherParticipant?.username || 'Unknown'
    : conversation.name || 'Group Chat';

  const avatarUrl = conversation.type === 'direct'
    ? otherParticipant?.avatarUrl
    : conversation.avatarUrl;

  const avatarFallback = displayName.charAt(0).toUpperCase();

  // Status text
  const getStatusText = () => {
    if (typingUsers.length > 0) {
      if (typingUsers.length === 1) {
        return `${typingUsers[0].username} est en train d'écrire...`;
      } else {
        return `${typingUsers.length} personnes écrivent...`;
      }
    }

    if (conversation.type === 'direct' && otherParticipant) {
      // Could add online status here if available
      return `@${otherParticipant.username}`;
    }

    if (conversation.type === 'group') {
      return `${conversation.participants.length} membres`;
    }

    return '';
  };

  return (
    <div className="border-b border-border bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Back Button (mobile) */}
        {onBack && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onBack}
            className="md:hidden flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        {/* Name and Status */}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-foreground truncate">
            {displayName}
          </h2>
          <p className={`text-sm truncate ${
            typingUsers.length > 0 ? 'text-primary' : 'text-muted-foreground'
          }`}>
            {getStatusText()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="flex-shrink-0">
            <Phone className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="flex-shrink-0">
            <Video className="h-5 w-5" />
          </Button>

          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="flex-shrink-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onInfo}>
                <Info className="h-4 w-4 mr-2" />
                Informations
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Supprimer la conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}