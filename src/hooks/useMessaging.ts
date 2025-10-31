
import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  writeBatch,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Conversation,
  ConversationListItem,
  ConversationParticipant,
  ConversationType,
  UseMessagingReturn,
  ParticipantDetail
} from '@/types/messaging';

export function useMessaging(): UseMessagingReturn {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Subscribe to conversations where user is a participant
      const conversationsQuery = query(
        collection(db, COLLECTIONS.CONVERSATIONS),
        where('participants', 'array-contains', user.uid),
        orderBy('updatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        conversationsQuery,
        async (snapshot) => {
          const conversationsList: ConversationListItem[] = [];

          for (const docSnap of snapshot.docs) {
            const conversationData = {
              id: docSnap.id,
              ...docSnap.data()
            } as Conversation;

            // Get participant details for this conversation
            const participantQuery = query(
              collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS),
              where('conversationId', '==', docSnap.id),
              where('userId', '==', user.uid)
            );

            const participantSnap = await getDocs(participantQuery);
            let unreadCount = 0;

            if (!participantSnap.empty) {
              const participantData = participantSnap.docs[0].data() as ConversationParticipant;
              const lastRead = participantData.lastRead;

              // Count unread messages
              if (conversationData.lastMessage && lastRead) {
                const lastMessageTime = conversationData.lastMessage.createdAt;
                if (lastMessageTime.toMillis() > lastRead.toMillis()) {
                  unreadCount = conversationData.lastMessage.unreadCount || 1;
                }
              }
            }

            // For direct messages, get the other participant
            let otherParticipant: ParticipantDetail | undefined;
            if (conversationData.type === 'direct') {
              const otherUserId = conversationData.participants.find(id => id !== user.uid);
              if (otherUserId) {
                otherParticipant = conversationData.participantDetails.find(
                  p => p.userId === otherUserId
                );
              }
            }

            conversationsList.push({
              conversation: conversationData,
              unreadCount,
              lastMessage: conversationData.lastMessage,
              otherParticipant
            });
          }

          setConversations(conversationsList);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching conversations:', err);
          setError(err as Error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up conversations listener:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [user]);

  const createConversation = useCallback(
    async (participantIds: string[], type: ConversationType, name?: string): Promise<string> => {
      if (!user) throw new Error('Not authenticated');

      const batch = writeBatch(db);

      // Fetch participant details from profiles
      const participantDetails: ParticipantDetail[] = [];
      for (const userId of participantIds) {
        const profileQuery = query(
          collection(db, COLLECTIONS.PROFILES),
          where('userId', '==', userId)
        );
        const profileSnap = await getDocs(profileQuery);
        
        if (!profileSnap.empty) {
          const profile = profileSnap.docs[0].data();
          participantDetails.push({
            userId,
            username: profile.username,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            joinedAt: Timestamp.now()
          });
        }
      }

      // Create conversation document
      const conversationRef = doc(collection(db, COLLECTIONS.CONVERSATIONS));
      batch.set(conversationRef, {
        type,
        name: name || null,
        avatarUrl: null,
        participants: participantIds,
        participantDetails,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid
      });

      // Create participant records for each user
      for (const userId of participantIds) {
        const participantRef = doc(collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS));
        batch.set(participantRef, {
          conversationId: conversationRef.id,
          userId,
          joinedAt: serverTimestamp(),
          lastRead: serverTimestamp(),
          notificationsEnabled: true,
          isPinned: false,
          isMuted: false
        });
      }

      await batch.commit();
      return conversationRef.id;
    },
    [user]
  );

  const deleteConversation = useCallback(
    async (conversationId: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const batch = writeBatch(db);

      // Delete conversation
      batch.delete(doc(db, COLLECTIONS.CONVERSATIONS, conversationId));

      // Delete all participant records
      const participantsQuery = query(
        collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS),
        where('conversationId', '==', conversationId)
      );
      const participantsSnap = await getDocs(participantsQuery);
      participantsSnap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      // Note: Messages are in a subcollection and will need separate deletion
      // or use Firebase Functions to cascade delete

      await batch.commit();
    },
    [user]
  );

  const updateConversation = useCallback(
    async (conversationId: string, updates: Partial<Conversation>): Promise<void> => {
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    },
    []
  );

  const markAsRead = useCallback(
    async (conversationId: string): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const participantQuery = query(
        collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS),
        where('conversationId', '==', conversationId),
        where('userId', '==', user.uid)
      );

      const participantSnap = await getDocs(participantQuery);
      if (!participantSnap.empty) {
        await updateDoc(participantSnap.docs[0].ref, {
          lastRead: serverTimestamp()
        });
      }
    },
    [user]
  );

  const pinConversation = useCallback(
    async (conversationId: string, isPinned: boolean): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const participantQuery = query(
        collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS),
        where('conversationId', '==', conversationId),
        where('userId', '==', user.uid)
      );

      const participantSnap = await getDocs(participantQuery);
      if (!participantSnap.empty) {
        await updateDoc(participantSnap.docs[0].ref, { isPinned });
      }
    },
    [user]
  );

  const muteConversation = useCallback(
    async (conversationId: string, isMuted: boolean): Promise<void> => {
      if (!user) throw new Error('Not authenticated');

      const participantQuery = query(
        collection(db, COLLECTIONS.CONVERSATION_PARTICIPANTS),
        where('conversationId', '==', conversationId),
        where('userId', '==', user.uid)
      );

      const participantSnap = await getDocs(participantQuery);
      if (!participantSnap.empty) {
        await updateDoc(participantSnap.docs[0].ref, { isMuted });
      }
    },
    [user]
  );

  return {
    conversations,
    loading,
    error,
    createConversation,
    deleteConversation,
    updateConversation,
    markAsRead,
    pinConversation,
    muteConversation
  };
}