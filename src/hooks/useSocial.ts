
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Friendship, 
  Block, 
  Friend, 
  FriendRequest, 
  BlockedUser, 
  SocialStats,
  FriendshipStatus 
} from '@/types/social';
import { useToast } from '@/hooks/use-toast';

export function useSocial(userId?: string) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [stats, setStats] = useState<SocialStats>({
    friends_count: 0,
    pending_requests_count: 0,
    sent_requests_count: 0,
    blocked_users_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchSocialData();
    }
  }, [userId]);

  const fetchSocialData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchFriends(),
        fetchFriendRequests(),
        fetchSentRequests(),
        fetchBlockedUsers()
      ]);
    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          requester_id,
          addressee_id,
          created_at,
          requester:profiles!friendships_requester_id_fkey(id, username, display_name, avatar_url),
          addressee:profiles!friendships_addressee_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

      if (error) throw error;

      const friendsList: Friend[] = data?.map(friendship => {
        const isRequester = friendship.requester_id === userId;
        const friendProfile = isRequester ? friendship.addressee : friendship.requester;
        
        return {
          id: friendProfile.id,
          user_id: friendProfile.id,
          username: friendProfile.username,
          display_name: friendProfile.display_name,
          avatar_url: friendProfile.avatar_url,
          friendship_id: friendship.id,
          friendship_created_at: friendship.created_at
        };
      }) || [];

      setFriends(friendsList);
      setStats(prev => ({ ...prev, friends_count: friendsList.length }));
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          requester:profiles!friendships_requester_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('addressee_id', userId)
        .eq('status', 'pending');

      if (error) throw error;

      const requests: FriendRequest[] = data?.map(friendship => ({
        id: friendship.id,
        requester: {
          id: friendship.requester.id,
          username: friendship.requester.username,
          display_name: friendship.requester.display_name,
          avatar_url: friendship.requester.avatar_url
        },
        addressee: {
          id: userId,
          username: '',
          display_name: '',
          avatar_url: ''
        },
        status: friendship.status as FriendshipStatus,
        created_at: friendship.created_at
      })) || [];

      setFriendRequests(requests);
      setStats(prev => ({ ...prev, pending_requests_count: requests.length }));
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          created_at,
          addressee:profiles!friendships_addressee_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('requester_id', userId)
        .eq('status', 'pending');

      if (error) throw error;

      const requests: FriendRequest[] = data?.map(friendship => ({
        id: friendship.id,
        requester: {
          id: userId,
          username: '',
          display_name: '',
          avatar_url: ''
        },
        addressee: {
          id: friendship.addressee.id,
          username: friendship.addressee.username,
          display_name: friendship.addressee.display_name,
          avatar_url: friendship.addressee.avatar_url
        },
        status: friendship.status as FriendshipStatus,
        created_at: friendship.created_at
      })) || [];

      setSentRequests(requests);
      setStats(prev => ({ ...prev, sent_requests_count: requests.length }));
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const fetchBlockedUsers = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('blocks')
        .select(`
          id,
          blocked_id,
          reason,
          created_at,
          blocked:profiles!blocks_blocked_id_fkey(id, username, display_name, avatar_url)
        `)
        .eq('blocker_id', userId);

      if (error) throw error;

      const blocked: BlockedUser[] = data?.map(block => ({
        id: block.blocked.id,
        user_id: block.blocked.id,
        username: block.blocked.username,
        display_name: block.blocked.display_name,
        avatar_url: block.blocked.avatar_url,
        block_id: block.id,
        blocked_at: block.created_at,
        reason: block.reason
      })) || [];

      setBlockedUsers(blocked);
      setStats(prev => ({ ...prev, blocked_users_count: blocked.length }));
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  };

  const sendFriendRequest = async (targetUserId: string) => {
    if (!userId) return false;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: userId,
          addressee_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      await fetchSentRequests();
      toast({
        title: "Demande envoyée",
        description: "Votre demande d'ami a été envoyée avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;

      await Promise.all([fetchFriends(), fetchFriendRequests()]);
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const declineFriendRequest = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'declined' })
        .eq('id', friendshipId);

      if (error) throw error;

      await fetchFriendRequests();
      toast({
        title: "Demande refusée",
        description: "La demande d'ami a été refusée",
      });
      return true;
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la demande",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeFriend = async (friendshipId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;

      await fetchFriends();
      toast({
        title: "Ami supprimé",
        description: "L'utilisateur a été retiré de votre liste d'amis",
      });
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet ami",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const blockUser = async (targetUserId: string, reason?: string) => {
    if (!userId) return false;

    setActionLoading(true);
    try {
      // First, remove any existing friendship
      await supabase
        .from('friendships')
        .delete()
        .or(`and(requester_id.eq.${userId},addressee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},addressee_id.eq.${userId})`);

      // Then create the block
      const { error } = await supabase
        .from('blocks')
        .insert({
          blocker_id: userId,
          blocked_id: targetUserId,
          reason
        });

      if (error) throw error;

      await Promise.all([fetchFriends(), fetchBlockedUsers()]);
      toast({
        title: "Utilisateur bloqué",
        description: "L'utilisateur a été bloqué avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de bloquer cet utilisateur",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const unblockUser = async (blockId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      await fetchBlockedUsers();
      toast({
        title: "Utilisateur débloqué",
        description: "L'utilisateur a été débloqué avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de débloquer cet utilisateur",
        variant: "destructive",
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    friends,
    friendRequests,
    sentRequests,
    blockedUsers,
    stats,
    loading,
    actionLoading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    refetch: fetchSocialData
  };
}