
import { Timestamp } from 'firebase/firestore';

// Firestore document types
export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  location: string | null;
  website: string | null;
  birthDate: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProfilePrivacy {
  id: string;
  userId: string;
  locationSharing: 'nobody' | 'public' | 'friends' | 'groups' | 'custom';
  profileVisibility: 'public' | 'friends' | 'private';
  showPhone: boolean;
  showEmail: boolean;
  showBirthDate: boolean;
  allowFriendRequests: boolean;
  allowGroupInvites: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: string | null;
  createdAt: Timestamp;
}

// Firestore collection names
export const COLLECTIONS = {
  PROFILES: 'profiles',
  PROFILE_PRIVACY: 'profilePrivacy',
  FRIENDSHIPS: 'friendships',
  BLOCKS: 'blocks',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  USER_LOCATIONS: 'userLocations',
  LOCATION_PERMISSIONS: 'locationPermissions',
  GROUPS: 'groups',
  GROUP_MEMBERS: 'groupMembers',
  BUSINESSES: 'businesses',
  BUSINESS_REVIEWS: 'businessReviews'
} as const;

// Helper type for Firestore document data (without Timestamp)
export type FirestoreData<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};