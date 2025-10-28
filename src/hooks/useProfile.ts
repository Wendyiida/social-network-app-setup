
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, ProfilePrivacySettings, ProfileUpdateRequest, PrivacyUpdateRequest } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [privacy, setPrivacy] = useState<ProfilePrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      fetchPrivacySettings(userId);
    }
  }, [userId]);

  const fetchProfile = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrivacySettings = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profile_privacy')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) throw error;
      setPrivacy(data);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  const updateProfile = async (updates: ProfileUpdateRequest) => {
    if (!userId) return false;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      await fetchProfile(userId);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updatePrivacySettings = async (updates: PrivacyUpdateRequest) => {
    if (!userId) return false;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profile_privacy')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      await fetchPrivacySettings(userId);
      toast({
        title: "Succès",
        description: "Paramètres de confidentialité mis à jour",
      });
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    privacy,
    loading,
    updating,
    updateProfile,
    updatePrivacySettings,
    refetch: () => {
      if (userId) {
        fetchProfile(userId);
        fetchPrivacySettings(userId);
      }
    }
  };
}