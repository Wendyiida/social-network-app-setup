
export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  email?: string;
  location?: string;
  website?: string;
  birth_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfilePrivacySettings {
  id: string;
  user_id: string;
  location_sharing: LocationSharingLevel;
  profile_visibility: ProfileVisibility;
  show_phone: boolean;
  show_email: boolean;
  show_birth_date: boolean;
  allow_friend_requests: boolean;
  allow_group_invites: boolean;
  created_at: string;
  updated_at: string;
}

export type LocationSharingLevel = 
  | 'nobody'
  | 'public'
  | 'friends'
  | 'groups'
  | 'custom';

export type ProfileVisibility = 
  | 'public'
  | 'friends'
  | 'private';

export interface ProfileFormData {
  username: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  birth_date: string;
}

export interface ProfileImageUpload {
  file: File;
  preview: string;
}

export interface ProfileStats {
  friends_count: number;
  groups_count: number;
  posts_count: number;
}

export interface ProfileUpdateRequest {
  username?: string;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  birth_date?: string;
  avatar_url?: string;
}

export interface PrivacyUpdateRequest {
  location_sharing?: LocationSharingLevel;
  profile_visibility?: ProfileVisibility;
  show_phone?: boolean;
  show_email?: boolean;
  show_birth_date?: boolean;
  allow_friend_requests?: boolean;
  allow_group_invites?: boolean;
}