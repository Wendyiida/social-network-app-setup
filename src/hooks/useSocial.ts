
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/types/database';
import type { Friendship, FriendRequest, Friend, SocialStats } from '@/types/social';
import { useAuth } from '@/contexts/AuthContext';

export function useSocial() {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [stats, setStats] = useState<SocialStats>({
    friends_count: 0,
    pending_requests_count: 0,
    sent_requests_count: 0,
    blocked_users_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Subscribe to friend requests (where user is addressee)
    const requestsQuery = query(
      collection(db, COLLECTIONS.FRIENDSHIPS),
      where('addresseeId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubRequests = onSnapshot(requestsQuery, async (snapshot) => {
      const requests: FriendRequest[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Friendship;
        // Fetch requester profile
        const profileDoc = await getDocs(
          query(collection(db, COLLECTIONS.PROFILES), where('userId', '==', data.requesterId))
        );
        if (!profileDoc.empty) {
          const profile = profileDoc.docs[0].data();
          requests.push({
            id: docSnap.id,
            requester: {
              id: data.requesterId,
              username: profile.username,
              display_name: profile.displayName,
              avatar_url: profile.avatarUrl
            },
            addressee: {
              id: data.addresseeId,
              username: '',
              display_name: '',
              avatar_url: ''
            },
            status: data.status,
            created_at: data.createdAt.toDate().toISOString()
          });
        }
      }
      setFriendRequests(requests);
      setStats(prev => ({ ...prev, pending_requests_count: requests.length }));
    });

    // Subscribe to sent requests (where user is requester)
    const sentQuery = query(
      collection(db, COLLECTIONS.FRIENDSHIPS),
      where('requesterId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubSent = onSnapshot(sentQuery, async (snapshot) => {
      const sent: FriendRequest[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Friendship;
        const profileDoc = await getDocs(
          query(collection(db, COLLECTIONS.PROFILES), where('userId', '==', data.addresseeId))
        );
        if (!profileDoc.empty) {
          const profile = profileDoc.docs[0].data();
          sent.push({
            id: docSnap.id,
            requester: {
              id: data.requesterId,
              username: '',
              display_name: '',
              avatar_url: ''
            },
            addressee: {
              id: data.addresseeId,
              username: profile.username,
              display_name: profile.displayName,
              avatar_url: profile.avatarUrl
            },
            status: data.status,
            created_at: data.createdAt.toDate().toISOString()
          });
        }
      }
      setSentRequests(sent);
      setStats(prev => ({ ...prev, sent_requests_count: sent.length }));
    });

    // Subscribe to friends (accepted friendships)
    const friendsQuery = query(
      collection(db, COLLECTIONS.FRIENDSHIPS),
      where('status', '==', 'accepted')
    );

    const unsubFriends = onSnapshot(friendsQuery, async (snapshot) => {
      const friendsList: Friend[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Friendship;
        const friendId = data.requesterId === user.uid ? data.addresseeId : data.requesterId;
        
        const profileDoc = await getDocs(
          query(collection(db, COLLECTIONS.PROFILES), where('userId', '==', friendId))
        );
        
        if (!profileDoc.empty) {
          const profile = profileDoc.docs[0].data();
          friendsList.push({
            id: profileDoc.docs[0].id,
            user_id: friendId,
            username: profile.username,
            display_name: profile.displayName,
            avatar_url: profile.avatarUrl,
            friendship_id: docSnap.id,
            friendship_created_at: data.createdAt.toDate().toISOString()
          });
        }
      }
      setFriends(friendsList);
      setStats(prev => ({ ...prev, friends_count: friendsList.length }));
      setLoading(false);
    });

    return () => {
      unsubRequests();
      unsubSent();
      unsubFriends();
    };
  }, [user]);

  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) throw new Error('Not authenticated');

    await addDoc(collection(db, COLLECTIONS.FRIENDSHIPS), {
      requesterId: user.uid,
      addresseeId,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    await updateDoc(doc(db, COLLECTIONS.FRIENDSHIPS, friendshipId), {
      status: 'accepted',
      updatedAt: Timestamp.now()
    });
  };

  const declineFriendRequest = async (friendshipId: string) => {
    await deleteDoc(doc(db, COLLECTIONS.FRIENDSHIPS, friendshipId));
  };

  const removeFriend = async (friendshipId: string) => {
    await deleteDoc(doc(db, COLLECTIONS.FRIENDSHIPS, friendshipId));
  };

  const blockUser = async (userId: string) => {
    if (!user) throw new Error('Not authenticated');

    await addDoc(collection(db, COLLECTIONS.BLOCKS), {
      blockerId: user.uid,
      blockedId: userId,
      reason: null,
      createdAt: Timestamp.now()
    });
  };

  return {
    friendRequests,
    sentRequests,
    friends,
    stats,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    blockUser
  };
}