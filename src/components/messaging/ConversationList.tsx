
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversationItem } from './ConversationItem';
import { useMessaging } from '@/hooks/useMessaging';
import { Search, Plus, MoreVertical, Pin, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { ConversationListItem } from '@/types/messaging';

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  activeConversationId?: string;
}

export function ConversationList({
  onSelectConversation,
  onNewConversation,
  activeConversationId
}: ConversationListProps) {
  const {
    conversations,
    loading,
    error,
    markAsRead,
    pinConversation,
    muteConversation,
    deleteConversation
  } = useMessaging();

  const [searchQuery, setSearchQuery] = useState('');
  const [participantStates, setParticipantStates] = useState<Record<string, { isPinned: boolean; isMuted: boolean }>>({});

  // Filter conversations based on search
  const filteredConversations = conversations.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const conv = item.conversation;

    if (conv.type === 'direct' && item.otherParticipant) {
      const name = item.otherParticipant.displayName || item.otherParticipant.username;
      return name.toLowerCase().includes(query);
    }

    if (conv.type === 'group' && conv.name) {
      return conv.name.toLowerCase().includes(query);
    }

    return false;
  });

  // Sort: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aState = participantStates[a.conversation.id];
    const bState = participantStates[b.conversation.id];

    if (aState?.isPinned && !bState?.isPinned) return -1;
    if (!aState?.isPinned && bState?.isPinned) return 1;

    const aTime = a.conversation.updatedAt.toMillis();
    const bTime = b.conversation.updatedAt.toMillis();
    return bTime - aTime;
  });

  const handlePin = async (conversationId: string, currentlyPinned: boolean) => {
    await pinConversation(conversationId, !currentlyPinned);
    setParticipantStates(prev => ({
      ...prev,
      [conversationId]: { ...prev[conversationId], isPinned: !currentlyPinned }
    }));
  };

  const handleMute = async (conversationId: string, currentlyMuted: boolean) => {
    await muteConversation(conversationId, !currentlyMuted);
    setParticipantStates(prev => ({
      ...prev,
      [conversationId]: { ...prev[conversationId], isMuted: !currentlyMuted }
    }));
  };

  const handleDelete = async (conversationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
      await deleteConversation(conversationId);
    }
  };

  const handleConversationClick = async (conversationId: string) => {
    onSelectConversation(conversationId);
    await markAsRead(conversationId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-destructive">Erreur: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Messages</h2>
          <Button size="icon" variant="default" onClick={onNewConversation}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </p>
            {!searchQuery && (
              <Button onClick={onNewConversation} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle conversation
              </Button>
            )}
          </div>
        ) : (
          <div>
            {sortedConversations.map((item) => {
              const state = participantStates[item.conversation.id] || { isPinned: false, isMuted: false };
              
              return (
                <div key={item.conversation.id} className="relative group">
                  <ConversationItem
                    conversation={item}
                    isActive={activeConversationId === item.conversation.id}
                    onClick={() => handleConversationClick(item.conversation.id)}
                    isPinned={state.isPinned}
                    isMuted={state.isMuted}
                  />

                  {/* Actions Menu */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePin(item.conversation.id, state.isPinned)}>
                          <Pin className="h-4 w-4 mr-2" />
                          {state.isPinned ? 'Désépingler' : 'Épingler'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMute(item.conversation.id, state.isMuted)}>
                          {state.isMuted ? (
                            <Volume2 className="h-4 w-4 mr-2" />
                          ) : (
                            <VolumeX className="h-4 w-4 mr-2" />
                          )}
                          {state.isMuted ? 'Réactiver' : 'Désactiver'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.conversation.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}