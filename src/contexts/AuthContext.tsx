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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(() => fetchUserData(session.user.id), 0);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setStoreId(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
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
