
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocial } from '@/hooks/useSocial';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FriendRequestCard } from '@/components/social/FriendRequestCard';
import { FriendsList } from '@/components/social/FriendsList';
import { SentRequestsList } from '@/components/social/SentRequestsList';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Send, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FriendsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    friends,
    friendRequests,
    sentRequests,
    stats,
    loading,
    actionLoading,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend
  } = useSocial(user?.id);

  const [activeTab, setActiveTab] = useState('friends');

  const handleAcceptRequest = async (id: string) => {
    await acceptFriendRequest(id);
  };

  const handleDeclineRequest = async (id: string) => {
    await declineFriendRequest(id);
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (confirm('Êtes-vous sûr de vouloir retirer cet ami ?')) {
      await removeFriend(friendshipId);
    }
  };

  const handleCancelRequest = async (id: string) => {
    await declineFriendRequest(id);
  };

  const handleMessage = (userId: string) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Amis</h1>
        <Button onClick={() => navigate('/discover')}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="friends" className="relative">
            <Users className="h-4 w-4 mr-2" />
            Amis
            {stats.friends_count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {stats.friends_count}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests" className="relative">
            <Clock className="h-4 w-4 mr-2" />
            Reçues
            {stats.pending_requests_count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                {stats.pending_requests_count}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="relative">
            <Send className="h-4 w-4 mr-2" />
            Envoyées
            {stats.sent_requests_count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                {stats.sent_requests_count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <FriendsList
            friends={friends}
            onRemove={handleRemoveFriend}
            onMessage={handleMessage}
            loading={actionLoading}
          />
        </TabsContent>

        <TabsContent value="requests">
          {friendRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune demande d'ami</p>
            </div>
          ) : (
            <div className="space-y-2">
              {friendRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDeclineRequest}
                  loading={actionLoading}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent">
          <SentRequestsList
            requests={sentRequests}
            onCancel={handleCancelRequest}
            loading={actionLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}