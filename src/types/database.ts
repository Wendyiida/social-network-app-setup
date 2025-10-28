
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          email: string | null;
          location: string | null;
          website: string | null;
          birth_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          email?: string | null;
          location?: string | null;
          website?: string | null;
          birth_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          email?: string | null;
          location?: string | null;
          website?: string | null;
          birth_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profile_privacy: {
        Row: {
          id: string;
          user_id: string;
          location_sharing: 'nobody' | 'public' | 'friends' | 'groups' | 'custom';
          profile_visibility: 'public' | 'friends' | 'private';
          show_phone: boolean;
          show_email: boolean;
          show_birth_date: boolean;
          allow_friend_requests: boolean;
          allow_group_invites: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          location_sharing?: 'nobody' | 'public' | 'friends' | 'groups' | 'custom';
          profile_visibility?: 'public' | 'friends' | 'private';
          show_phone?: boolean;
          show_email?: boolean;
          show_birth_date?: boolean;
          allow_friend_requests?: boolean;
          allow_group_invites?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          location_sharing?: 'nobody' | 'public' | 'friends' | 'groups' | 'custom';
          profile_visibility?: 'public' | 'friends' | 'private';
          show_phone?: boolean;
          show_email?: boolean;
          show_birth_date?: boolean;
          allow_friend_requests?: boolean;
          allow_group_invites?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'declined' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'declined' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: 'pending' | 'accepted' | 'declined' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
      };
      blocks: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          blocker_id: string;
          blocked_id: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          blocker_id?: string;
          blocked_id?: string;
          reason?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      location_sharing_level: 'nobody' | 'public' | 'friends' | 'groups' | 'custom';
      profile_visibility: 'public' | 'friends' | 'private';
      friendship_status: 'pending' | 'accepted' | 'declined' | 'blocked';
    };
  };
}