import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingContextType {
  showWelcome: boolean;
  dismissWelcome: () => void;
  steps: OnboardingStep[];
  completeStep: (id: string) => void;
  completedCount: number;
  totalSteps: number;
  progress: number; // 0-100
  // Tour
  tourActive: boolean;
  tourStep: number;
  startTour: () => void;
  startGuideTour: (steps: TourStep[], navigateTo?: string) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  tourSteps: TourStep[];
  isOnboardingDone: boolean;
  guideTourRoute: string | null;
}

export interface TourStep {
  targetId: string; // DOM id to highlight
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'nav-dashboard',
    title: 'Your Dashboard',
    description: 'See all your sales metrics, revenue trends, and business insights at a glance.',
    position: 'right',
  },
  {
    targetId: 'nav-pos',
    title: 'POS Terminal',
    description: 'Your point-of-sale. Tap products, select payment method, and checkout in seconds.',
    position: 'right',
  },
  {
    targetId: 'nav-inventory',
    title: 'Inventory Management',
    description: 'Track stock levels, add new products, and get alerts when stock is running low.',
    position: 'right',
  },
  {
    targetId: 'nav-sales',
    title: 'Sales History',
    description: 'View all past transactions, filter by date, and reprint receipts anytime.',
    position: 'right',
  },
  {
    targetId: 'nav-staff',
    title: 'Staff Management',
    description: 'Add cashiers and managers with role-based permissions to control who can do what.',
    position: 'right',
  },
];

const DEFAULT_STEPS: Omit<OnboardingStep, 'completed'>[] = [
  { id: 'setup_store', title: 'Set up your store', description: 'Your store has been created automatically' },
  { id: 'add_product', title: 'Add a product', description: 'Add or customize products in your inventory' },
  { id: 'make_sale', title: 'Make your first sale', description: 'Complete a transaction on the POS terminal' },
  { id: 'add_staff', title: 'Add a staff member', description: 'Create a cashier or manager account' },
  { id: 'configure_receipt', title: 'Configure receipts', description: 'Set up your printer and receipt branding' },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

function getStorageKey(userId: string) {
  return `onboarding_${userId}`;
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, storeId, role } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [customTourSteps, setCustomTourSteps] = useState<TourStep[] | null>(null);
  const [guideTourRoute, setGuideTourRoute] = useState<string | null>(null);

  // Load state from localStorage
  useEffect(() => {
    if (!user) {
      setInitialized(false);
      return;
    }

    const key = getStorageKey(user.id);
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedSteps(new Set(parsed.completedSteps || []));
        setShowWelcome(false);
      } catch {
        setShowWelcome(true);
      }
    } else {
      // First time user - auto-complete setup_store since it's done on signup
      const initial = new Set(['setup_store']);
      setCompletedSteps(initial);
      setShowWelcome(true);
      localStorage.setItem(key, JSON.stringify({ completedSteps: ['setup_store'] }));
    }
    setInitialized(true);
  }, [user]);

  // Auto-detect completed steps based on real data
  useEffect(() => {
    if (!user || !storeId || !initialized) return;

    const checkProgress = async () => {
      const newCompleted = new Set(completedSteps);

      // Check products
      const { count: productCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId);
      if (productCount && productCount > 0) newCompleted.add('add_product');

      // Check sales
      const { count: salesCount } = await supabase
        .from('sales')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId);
      if (salesCount && salesCount > 0) newCompleted.add('make_sale');

      // Check staff (more than just the owner)
      if (role === 'owner') {
        const { count: staffCount } = await supabase
          .from('user_roles')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId);
        if (staffCount && staffCount > 1) newCompleted.add('add_staff');

        // Check receipt config
        const { data: store } = await supabase
          .from('stores')
          .select('receipt_header')
          .eq('id', storeId)
          .single();
        if (store?.receipt_header && store.receipt_header !== 'Your Store Name') {
          newCompleted.add('configure_receipt');
        }
      }

      if (newCompleted.size !== completedSteps.size) {
        setCompletedSteps(newCompleted);
        localStorage.setItem(getStorageKey(user.id), JSON.stringify({ completedSteps: Array.from(newCompleted) }));
      }
    };

    checkProgress();
  }, [user, storeId, initialized]);

  const steps: OnboardingStep[] = DEFAULT_STEPS.map(s => ({
    ...s,
    completed: completedSteps.has(s.id),
  }));

  const completeStep = useCallback((id: string) => {
    if (!user) return;
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(getStorageKey(user.id), JSON.stringify({ completedSteps: Array.from(next) }));
      return next;
    });
  }, [user]);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const startTour = useCallback(() => {
    setShowWelcome(false);
    setCustomTourSteps(null);
    setGuideTourRoute(null);
    setTourStep(0);
    setTourActive(true);
  }, []);

  const startGuideTour = useCallback((steps: TourStep[], navigateTo?: string) => {
    setShowWelcome(false);
    setCustomTourSteps(steps);
    setGuideTourRoute(navigateTo || null);
    setTourStep(0);
    setTourActive(true);
  }, []);

  const activeTourSteps = customTourSteps || TOUR_STEPS;

  const nextTourStep = useCallback(() => {
    setTourStep(prev => {
      if (prev >= activeTourSteps.length - 1) {
        setTourActive(false);
        setCustomTourSteps(null);
        setGuideTourRoute(null);
        return 0;
      }
      return prev + 1;
    });
  }, [activeTourSteps.length]);

  const prevTourStep = useCallback(() => {
    setTourStep(prev => Math.max(0, prev - 1));
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
    setTourStep(0);
    setCustomTourSteps(null);
    setGuideTourRoute(null);
  }, []);

  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isOnboardingDone = completedCount >= totalSteps;

  return (
    <OnboardingContext.Provider value={{
      showWelcome, dismissWelcome, steps, completeStep,
      completedCount, totalSteps, progress,
      tourActive, tourStep, startTour, startGuideTour, nextTourStep, prevTourStep, endTour,
      tourSteps: activeTourSteps,
      isOnboardingDone,
      guideTourRoute,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (ctx === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
