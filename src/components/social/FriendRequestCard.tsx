
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FriendRequest } from '@/types/social';
import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  loading?: boolean;
}

export function FriendRequestCard({ request, onAccept, onDecline, loading }: FriendRequestCardProps) {
  const { requester, created_at, id } = request;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={requester.avatar_url} alt={requester.username} />
          <AvatarFallback>{requester.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            {requester.display_name || requester.username}
          </p>
          <p className="text-sm text-muted-foreground">@{requester.username}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onAccept(id)}
            disabled={loading}
            className="h-9 w-9 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDecline(id)}
            disabled={loading}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}