
export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason?: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  requester: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  addressee: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  status: FriendshipStatus;
  created_at: string;
}

export interface Friend {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  friendship_id: string;
  friendship_created_at: string;
  is_online?: boolean;
  last_seen?: string;
}

export interface BlockedUser {
  id: string;
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  block_id: string;
  blocked_at: string;
  reason?: string;
}

export interface SocialStats {
  friends_count: number;
  pending_requests_count: number;
  sent_requests_count: number;
  blocked_users_count: number;
}

export interface UserSearchResult {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  location?: string;
  mutual_friends_count: number;
  friendship_status?: FriendshipStatus;
  is_blocked: boolean;
  is_blocking: boolean;
}

export interface SocialAction {
  type: 'send_request' | 'accept_request' | 'decline_request' | 'remove_friend' | 'block_user' | 'unblock_user';
  user_id: string;
  friendship_id?: string;
  block_id?: string;
}