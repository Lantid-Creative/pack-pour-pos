import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppSidebarNav } from '@/components/AppSidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePermissions, Permission } from '@/hooks/usePermissions';
import { AlertTriangle, X, LayoutDashboard, ShoppingCart, Package, History, Users } from 'lucide-react';
import { useState } from 'react';

const mobileNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'page:dashboard' as Permission },
  { path: '/pos', label: 'POS', icon: ShoppingCart, permission: 'page:pos' as Permission },
  { path: '/inventory', label: 'Inventory', icon: Package, permission: 'page:inventory' as Permission },
  { path: '/sales', label: 'Sales', icon: History, permission: 'page:sales_history' as Permission },
  { path: '/staff', label: 'Staff', icon: Users, permission: 'page:staff' as Permission },
];

export default function AppLayout() {
  const { isTrialing, trialEndsAt, role } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);

  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const showBanner = isTrialing && daysLeft !== null && daysLeft <= 3 && !dismissed;

  // On POS page mobile, hide the bottom nav (POS has its own tab bar)
  const isPOSPage = location.pathname === '/pos';
  const showMobileNav = isMobile && !isPOSPage;

  const visibleMobileItems = mobileNavItems.filter(item => hasPermission(item.permission));

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {!isMobile && <AppSidebarNav />}
      <div className="flex-1 overflow-hidden flex flex-col">
        {showBanner && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-destructive font-medium text-xs sm:text-sm">
                {daysLeft === 0
                  ? 'Your free trial expires today!'
                  : `Trial expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
              </span>
              {role === 'owner' && (
                <button
                  onClick={() => navigate('/subscription')}
                  className="ml-2 text-xs font-semibold text-destructive underline underline-offset-2 hover:opacity-80"
                >
                  Subscribe now
                </button>
              )}
            </div>
            <button onClick={() => setDismissed(true)} className="text-destructive/60 hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
        {/* Mobile bottom navigation */}
        {showMobileNav && (
          <div className="h-14 border-t border-border bg-card flex shrink-0 safe-area-bottom">
            {visibleMobileItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
