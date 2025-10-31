
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  serverTimestamp,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import type {
  Message,
  Conversation,
  MessageType,
  UseConversationReturn,
  ParticipantDetail,
  TypingIndicator
} from '@/types/messaging';

const MESSAGES_PER_PAGE = 50;
const TYPING_TIMEOUT = 3000; // 3 seconds

export function useConversation(conversationId: string): UseConversationReturn {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [typingUsers, setTypingUsers] = useState<ParticipantDetail[]>([]);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to conversation details
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.CONVERSATIONS, conversationId),
      (docSnap) => {
        if (docSnap.exists()) {
          setConversation({
            id: docSnap.id,
            ...docSnap.data()
          } as Conversation);
        }
      },
      (err) => {
        console.error('Error fetching conversation:', err);
        setError(err as Error);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const messagesQuery = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'desc'),
      limit(MESSAGES_PER_PAGE)
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesList: Message[] = [];
        
        snapshot.docs.forEach((docSnap) => {
          messagesList.push({
            id: docSnap.id,
            ...docSnap.data()
          } as Message);
        });

        // Store last document for pagination
        if (snapshot.docs.length > 0) {
          lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
        }

        setMessages(messagesList.reverse());
        setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching messages:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!conversationId || !user) return;

    const typingQuery = query(
      collection(db, COLLECTIONS.TYPING_INDICATORS),
      where('conversationId', '==', conversationId)
    );

    const unsubscribe = onSnapshot(typingQuery, (snapshot) => {
      const typing: ParticipantDetail[] = [];
      const now = Timestamp.now();

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as TypingIndicator;
        
        // Only show typing if it's not the current user and within timeout
        if (data.userId !== user.uid) {
          const timeDiff = now.toMillis() - data.timestamp.toMillis();
          if (timeDiff < TYPING_TIMEOUT) {
            // Find participant details from conversation
            const participant = conversation?.participantDetails.find(
              p => p.userId === data.userId
            );
            if (participant) {
              typing.push(participant);
            }
          }
        }
      });

      setTypingUsers(typing);
    });

    return () => unsubscribe();
  }, [conversationId, user, conversation]);

  const sendMessage = useCallback(
    async (content: string, type: MessageType = 'text', mediaUrl?: string): Promise<void> => {
      if (!user || !conversationId) throw new Error('Not authenticated or no conversation');

      // Get sender details
      const profileQuery = query(
        collection(db, COLLECTIONS.PROFILES),
        where('userId', '==', user.uid)
      );
      const profileSnap = await getDocs(profileQuery);
      
      let senderName = user.displayName || 'Unknown';
      let senderAvatar: string | undefined;
      
      if (!profileSnap.empty) {
        const profile = profileSnap.docs[0].data();
        senderName = profile.displayName || profile.username;
        senderAvatar = profile.avatarUrl;
      }

      // Add message to subcollection
      const messageRef = await addDoc(
        collection(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES),
        {
          conversationId,
          senderId: user.uid,
          senderName,
          senderAvatar,
          type,
          content,
          mediaUrl: mediaUrl || null,
          status: 'sent',
          readBy: [user.uid],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      );

      // Update conversation's lastMessage
      await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
        lastMessage: {
          id: messageRef.id,
          senderId: user.uid,
          senderName,
          content,
          type,
          createdAt: Timestamp.now(),
          unreadCount: 1
        },
        updatedAt: serverTimestamp()
      });

      // Clear typing indicator
      await setTyping(false);
    },
    [user, conversationId]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (!conversationId || !lastDocRef.current || !hasMore) return;

    const messagesQuery = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES),
      orderBy('createdAt', 'desc'),
      startAfter(lastDocRef.current),
      limit(MESSAGES_PER_PAGE)
    );

    const snapshot = await getDocs(messagesQuery);
    
    if (snapshot.docs.length > 0) {
      const olderMessages: Message[] = [];
      
      snapshot.docs.forEach((docSnap) => {
        olderMessages.push({
          id: docSnap.id,
          ...docSnap.data()
        } as Message);
      });

      lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
      setMessages((prev) => [...olderMessages.reverse(), ...prev]);
      setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
    } else {
      setHasMore(false);
    }
  }, [conversationId, hasMore]);

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      if (!conversationId) throw new Error('No conversation');

      await deleteDoc(
        doc(db, COLLECTIONS.CONVERSATIONS, conversationId, COLLECTIONS.MESSAGES, messageId)
      );
    },
    [conversationId]
  );

  const setTyping = useCallback(
    async (isTyping: boolean): Promise<void> => {
      if (!user || !conversationId) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const typingQuery = query(
        collection(db, COLLECTIONS.TYPING_INDICATORS),
        where('conversationId', '==', conversationId),
        where('userId', '==', user.uid)
      );

      const typingSnap = await getDocs(typingQuery);

      if (isTyping) {
        if (typingSnap.empty) {
          // Create typing indicator
          await addDoc(collection(db, COLLECTIONS.TYPING_INDICATORS), {
            conversationId,
            userId: user.uid,
            username: user.displayName || 'Unknown',
            timestamp: serverTimestamp()
          });
        } else {
          // Update timestamp
          await updateDoc(typingSnap.docs[0].ref, {
            timestamp: serverTimestamp()
          });
        }

        // Auto-remove after timeout
        typingTimeoutRef.current = setTimeout(async () => {
          if (!typingSnap.empty) {
            await deleteDoc(typingSnap.docs[0].ref);
          }
        }, TYPING_TIMEOUT);
      } else {
        // Remove typing indicator
        if (!typingSnap.empty) {
          await deleteDoc(typingSnap.docs[0].ref);
        }
      }
    },
    [user, conversationId]
  );

  return {
    messages,
    conversation,
    loading,
    error,
    hasMore,
    sendMessage,
    loadMore,
    deleteMessage,
    setTyping,
    typingUsers
  };
}