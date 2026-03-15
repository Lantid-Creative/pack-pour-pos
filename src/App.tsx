import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TourOverlay } from "@/components/TourOverlay";
import { usePermissions } from "@/hooks/usePermissions";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { PageSkeleton } from "@/components/PageSkeleton";

// Lazy-loaded pages
const AuthPage = lazy(() => import("./pages/AuthPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const StoreSetupPage = lazy(() => import("./pages/StoreSetupPage"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const POSPage = lazy(() => import("./pages/POSPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const SalesHistoryPage = lazy(() => import("./pages/SalesHistoryPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const StoreSettingsPage = lazy(() => import("./pages/StoreSettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PaywallPage = lazy(() => import("./pages/PaywallPage"));

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, storeId, loading, subscriptionActive } = useAuth();
  const { hasPermission } = usePermissions();
  const location = useLocation();

  // Session timeout for authenticated users
  useSessionTimeout();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    );
  }

  if (!storeId || !role) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/setup" element={<StoreSetupPage />} />
          <Route path="*" element={<Navigate to="/setup" replace />} />
        </Routes>
      </Suspense>
    );
  }

  if (!subscriptionActive) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/paywall" element={<PaywallPage />} />
          <Route path="*" element={<Navigate to="/paywall" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={hasPermission('page:dashboard') ? <DashboardPage /> : <Navigate to="/pos" replace />} />
            <Route path="/pos" element={hasPermission('page:pos') ? <POSPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/inventory" element={hasPermission('page:inventory') ? <InventoryPage /> : <Navigate to="/pos" replace />} />
            <Route path="/sales" element={hasPermission('page:sales_history') ? <SalesHistoryPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/staff" element={hasPermission('page:staff') ? <StaffPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/subscription" element={role === 'owner' ? <SubscriptionPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/settings" element={role === 'owner' ? <StoreSettingsPage /> : <Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/setup" element={<Navigate to={hasPermission('page:dashboard') ? '/dashboard' : '/pos'} replace />} />
          <Route path="/login" element={<Navigate to={hasPermission('page:dashboard') ? '/dashboard' : '/pos'} replace />} />
          <Route path="/paywall" element={<Navigate to={hasPermission('page:dashboard') ? '/dashboard' : '/pos'} replace />} />
          <Route path="/" element={<Navigate to={hasPermission('page:dashboard') ? '/dashboard' : '/pos'} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
            <WelcomeModal />
            <TourOverlay />
            <AppRoutes />
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
