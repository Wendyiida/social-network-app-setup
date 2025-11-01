
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSocial } from '@/hooks/useSocial';
import { useMessaging } from '@/hooks/useMessaging';
import { ConversationType } from '@/types/messaging';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversationId: string) => void;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  onConversationCreated
}: NewConversationDialogProps) {
  const { friends } = useSocial();
  const { createConversation } = useMessaging();

  const [type, setType] = useState<ConversationType>('direct');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const filteredFriends = friends.filter((friend) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = friend.display_name || friend.username;
    return name.toLowerCase().includes(query) || friend.username.toLowerCase().includes(query);
  });

  const handleToggleFriend = (userId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (selectedFriends.length === 0) {
      toast.error('Sélectionnez au moins un ami');
      return;
    }

    if (type === 'group' && !groupName.trim()) {
      toast.error('Entrez un nom pour le groupe');
      return;
    }

    setCreating(true);
    try {
      const conversationId = await createConversation(
        selectedFriends,
        type,
        type === 'group' ? groupName : undefined
      );

      toast.success(
        type === 'direct' ? 'Conversation créée' : 'Groupe créé'
      );

      onConversationCreated(conversationId);
      onOpenChange(false);

      // Reset form
      setSelectedFriends([]);
      setGroupName('');
      setSearchQuery('');
      setType('direct');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
          <DialogDescription>
            Sélectionnez des amis pour démarrer une conversation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as ConversationType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct" className="font-normal cursor-pointer">
                  Message direct
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="font-normal cursor-pointer">
                  Groupe
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Group Name */}
          {type === 'group' && (
            <div className="space-y-2">
              <Label htmlFor="groupName">Nom du groupe</Label>
              <Input
                id="groupName"
                placeholder="Entrez le nom du groupe"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          {/* Search Friends */}
          <div className="space-y-2">
            <Label>Sélectionner des amis</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Friends List */}
          <ScrollArea className="h-64 border rounded-md">
            {filteredFriends.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Aucun ami trouvé' : 'Aucun ami'}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleToggleFriend(friend.user_id)}
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friend.user_id)}
                      onCheckedChange={() => handleToggleFriend(friend.user_id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar_url} alt={friend.username} />
                      <AvatarFallback>
                        {friend.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {friend.display_name || friend.username}
                      </p>
                      <p className="text-xs text-muted-foreground">@{friend.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Selected Count */}
          {selectedFriends.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedFriends.length} ami{selectedFriends.length > 1 ? 's' : ''} sélectionné{selectedFriends.length > 1 ? 's' : ''}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreate}
              disabled={creating || selectedFriends.length === 0}
            >
              {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Créer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}