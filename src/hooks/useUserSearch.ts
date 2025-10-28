
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { UserSearchResult } from '@/types/social';
import { useToast } from '@/hooks/use-toast';

export function useUserSearch(currentUserId?: string) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const debouncedSearchQuery = useMemo(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    return debouncedSearchQuery;
  }, [debouncedSearchQuery]);

  const performSearch = async (query: string) => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Search for users by username or display_name
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, location')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .neq('user_id', currentUserId)
        .limit(20);

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        setSearchResults([]);
        return;
      }

      const userIds = users.map(user => user.id);

      // Get friendship status for each user
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id, status')
        .or(`and(requester_id.eq.${currentUserId},addressee_id.in.(${userIds.join(',')})),and(addressee_id.eq.${currentUserId},requester_id.in.(${userIds.join(',')}))`);

      if (friendshipsError) throw friendshipsError;

      // Get blocks
      const { data: blocks, error: blocksError } = await supabase
        .from('blocks')
        .select('blocker_id, blocked_id')
        .or(`and(blocker_id.eq.${currentUserId},blocked_id.in.(${userIds.join(',')})),and(blocked_id.eq.${currentUserId},blocker_id.in.(${userIds.join(',')}))`);

      if (blocksError) throw blocksError;

      // Process results
      const results: UserSearchResult[] = users.map(user => {
        const friendship = friendships?.find(f => 
          (f.requester_id === currentUserId && f.addressee_id === user.id) ||
          (f.addressee_id === currentUserId && f.requester_id === user.id)
        );

        const isBlocked = blocks?.some(b => 
          b.blocker_id === currentUserId && b.blocked_id === user.id
        ) || false;

        const isBlocking = blocks?.some(b => 
          b.blocked_id === currentUserId && b.blocker_id === user.id
        ) || false;

        return {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          location: user.location,
          mutual_friends_count: 0, // TODO: Calculate mutual friends
          friendship_status: friendship?.status,
          is_blocked: isBlocked,
          is_blocking: isBlocking
        };
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de rechercher des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    clearResults: () => {
      setSearchResults([]);
      setSearchQuery('');
    }
  };
}