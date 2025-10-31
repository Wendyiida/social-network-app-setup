
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/types/database';
import type { Profile, ProfilePrivacy } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [privacy, setPrivacy] = useState<ProfilePrivacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Subscribe to profile
    const profileQuery = query(
      collection(db, COLLECTIONS.PROFILES),
      where('userId', '==', user.uid)
    );

    const unsubProfile = onSnapshot(profileQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setProfile({
          id: snapshot.docs[0].id,
          ...data
        } as Profile);
      }
      setLoading(false);
    });

    // Subscribe to privacy settings
    const privacyQuery = query(
      collection(db, COLLECTIONS.PROFILE_PRIVACY),
      where('userId', '==', user.uid)
    );

    const unsubPrivacy = onSnapshot(privacyQuery, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setPrivacy({
          id: snapshot.docs[0].id,
          ...data
        } as ProfilePrivacy);
      }
    });

    return () => {
      unsubProfile();
      unsubPrivacy();
    };
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) throw new Error('No profile found');

    await updateDoc(doc(db, COLLECTIONS.PROFILES, profile.id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const updatePrivacy = async (updates: Partial<ProfilePrivacy>) => {
    if (!privacy) throw new Error('No privacy settings found');

    await updateDoc(doc(db, COLLECTIONS.PROFILE_PRIVACY, privacy.id), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  };

  const createProfile = async (data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Not authenticated');

    const profileRef = await addDoc(collection(db, COLLECTIONS.PROFILES), {
      ...data,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Create default privacy settings
    await addDoc(collection(db, COLLECTIONS.PROFILE_PRIVACY), {
      userId: user.uid,
      locationSharing: 'friends',
      profileVisibility: 'public',
      showPhone: false,
      showEmail: false,
      showBirthDate: false,
      allowFriendRequests: true,
      allowGroupInvites: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return profileRef.id;
  };

  return {
    profile,
    privacy,
    loading,
    updateProfile,
    updatePrivacy,
    createProfile
  };
}