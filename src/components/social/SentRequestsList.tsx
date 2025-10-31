
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FriendRequest } from '@/types/social';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SentRequestsListProps {
  requests: FriendRequest[];
  onCancel: (id: string) => void;
  loading?: boolean;
}

export function SentRequestsList({ requests, onCancel, loading }: SentRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune demande envoyée</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={request.addressee.avatar_url} alt={request.addressee.username} />
              <AvatarFallback>{request.addressee.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {request.addressee.display_name || request.addressee.username}
              </p>
              <p className="text-sm text-muted-foreground">@{request.addressee.username}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Envoyée {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: fr })}
              </p>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel(request.id)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}