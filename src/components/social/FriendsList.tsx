
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Friend } from '@/types/social';
import { UserMinus, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FriendsListProps {
  friends: Friend[];
  onRemove: (friendshipId: string) => void;
  onMessage?: (userId: string) => void;
  loading?: boolean;
}

export function FriendsList({ friends, onRemove, onMessage, loading }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun ami pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <Card key={friend.id} className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={friend.avatar_url} alt={friend.username} />
              <AvatarFallback>{friend.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {friend.display_name || friend.username}
              </p>
              <p className="text-sm text-muted-foreground">@{friend.username}</p>
              {friend.is_online && (
                <p className="text-xs text-green-600 mt-1">En ligne</p>
              )}
              {!friend.is_online && friend.last_seen && (
                <p className="text-xs text-muted-foreground mt-1">
                  Vu {formatDistanceToNow(new Date(friend.last_seen), { addSuffix: true, locale: fr })}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {onMessage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMessage(friend.user_id)}
                  disabled={loading}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemove(friend.friendship_id)}
                disabled={loading}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}