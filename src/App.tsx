import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import StoreSetupPage from "./pages/StoreSetupPage";
import AppLayout from "./layouts/AppLayout";
import POSPage from "./pages/POSPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import SalesHistoryPage from "./pages/SalesHistoryPage";
import StaffPage from "./pages/StaffPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, role, storeId, loading } = useAuth();
  const { hasPermission } = usePermissions();

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // User is authenticated but has no store/role — needs store setup
  if (!storeId || !role) {
    return (
      <Routes>
        <Route path="/setup" element={<StoreSetupPage />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={hasPermission('page:dashboard') ? <DashboardPage /> : <Navigate to="/pos" replace />} />
        <Route path="/pos" element={hasPermission('page:pos') ? <POSPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/inventory" element={hasPermission('page:inventory') ? <InventoryPage /> : <Navigate to="/pos" replace />} />
        <Route path="/sales" element={hasPermission('page:sales_history') ? <SalesHistoryPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/staff" element={hasPermission('page:staff') ? <StaffPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/subscription" element={role === 'owner' ? <SubscriptionPage /> : <Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/" element={<Navigate to={hasPermission('page:dashboard') ? '/dashboard' : '/pos'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
