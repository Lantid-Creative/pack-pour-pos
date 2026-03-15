import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type AppRole = 'owner' | 'manager' | 'cashier';

interface AuthContextType {
  user: User | null;
  profile: { full_name: string; store_id: string | null; lifetime_access: boolean } | null;
  role: AppRole | null;
  storeId: string | null;
  loading: boolean;
  subscriptionActive: boolean;
  trialEndsAt: Date | null;
  isTrialing: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refetchSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; store_id: string | null; lifetime_access: boolean } | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);

  const checkSubscriptionStatus = async (stId: string, hasLifetimeAccess: boolean) => {
    // Lifetime access bypasses all checks
    if (hasLifetimeAccess) {
      setSubscriptionActive(true);
      setIsTrialing(false);
      return;
    }

    // Check subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('store_id', stId)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle();

    if (sub) {
      setSubscriptionActive(true);
      setIsTrialing(false);
      return;
    }

    // Check trial
    const { data: store } = await supabase
      .from('stores')
      .select('trial_ends_at')
      .eq('id', stId)
      .single();

    if (store?.trial_ends_at) {
      const trialEnd = new Date(store.trial_ends_at);
      setTrialEndsAt(trialEnd);
      const now = new Date();
      if (trialEnd > now) {
        setIsTrialing(true);
        setSubscriptionActive(true);
      } else {
        setIsTrialing(false);
        setSubscriptionActive(false);
      }
    } else {
      setSubscriptionActive(false);
      setIsTrialing(false);
    }
  };

  const refetchSubscription = async () => {
    if (storeId) {
      await checkSubscriptionStatus(storeId, profile?.lifetime_access ?? false);
    }
  };

  const fetchUserData = async (userId: string) => {
    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, store_id, lifetime_access')
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
      .maybeSingle();

    if (roleData) {
      setRole(roleData.role as AppRole);
      setStoreId(roleData.store_id);
      await checkSubscriptionStatus(roleData.store_id);
    } else {
      setRole(null);
      setStoreId(null);
      setSubscriptionActive(false);
      setIsTrialing(false);
    }
  };

  useEffect(() => {
    let initialLoadDone = false;

    const loadUserData = async (sessionUser: User | null) => {
      if (!sessionUser) {
        setUser(null);
        setProfile(null);
        setRole(null);
        setStoreId(null);
        setSubscriptionActive(false);
        setIsTrialing(false);
        setTrialEndsAt(null);
        setLoading(false);
        return;
      }

      setUser(sessionUser);

      try {
        await fetchUserData(sessionUser.id);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only reload user data on actual auth changes, not token refreshes
      if (event === 'SIGNED_OUT') {
        loadUserData(null);
      } else if (event === 'SIGNED_IN') {
        // Only reload if this isn't the initial session pickup (handled below)
        if (initialLoadDone) {
          loadUserData(session?.user ?? null);
        }
      }
      // TOKEN_REFRESHED, USER_UPDATED — user object updated but role/store unchanged
      // Just update the user object without refetching everything
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserData(session?.user ?? null).then(() => {
        initialLoadDone = true;
      });
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
    <AuthContext.Provider value={{
      user, profile, role, storeId, loading,
      subscriptionActive, trialEndsAt, isTrialing,
      signIn, signUp, signOut, refetchSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
