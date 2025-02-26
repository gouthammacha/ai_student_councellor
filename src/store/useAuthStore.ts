import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) set({ error: error.message });
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign up';
      set({ error: errorMessage });
      return { error: error as Error };
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) set({ error: error.message });
      return { error };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign in';
      set({ error: errorMessage });
      return { error: error as Error };
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign out';
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    useAuthStore.setState({ error: error.message, loading: false });
  } else {
    useAuthStore.setState({ user: session?.user ?? null, loading: false });
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ user: session?.user ?? null });
});