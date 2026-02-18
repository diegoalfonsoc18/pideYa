import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '@/types/database.types';

export const authService = {
  async signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    phone?: string
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, phone: phone ?? null },
      },
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
