
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
    };
  };
}