import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type AppRole = 'owner' | 'manager' | 'cashier';

interface AuthContextType {
  user: User | null;
  profile: { full_name: string; store_id: string | null } | null;
  role: AppRole | null;
  storeId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; store_id: string | null } | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, store_id')
      .eq('user_id', userId)
      .single();

    if (profileData) {
      setProfile(profileData);
    }

    // Get role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role, store_id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (roleData) {
      setRole(roleData.role as AppRole);
      setStoreId(roleData.store_id);
    } else {
      setRole(null);
      setStoreId(null);
    }
  };

  useEffect(() => {
    const loadUserData = async (sessionUser: User | null) => {
      if (!sessionUser) {
        setUser(null);
        setProfile(null);
        setRole(null);
        setStoreId(null);
        setLoading(false);
        return;
      }

      setUser(sessionUser);
      setProfile(null);
      setRole(null);
      setStoreId(null);

      try {
        await fetchUserData(sessionUser.id);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Keep async work out of the callback to avoid Supabase auth deadlocks
      setTimeout(() => {
        void loadUserData(session?.user ?? null);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void loadUserData(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } }
    });

    // Save phone to profile after signup
    if (!error && data.user && phone) {
      await supabase
        .from('profiles')
        .update({ phone: phone.trim() })
        .eq('user_id', data.user.id);
    }

    return { error: error?.message || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, role, storeId, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
