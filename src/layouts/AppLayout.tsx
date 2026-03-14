import { Outlet, useNavigate } from 'react-router-dom';
import { AppSidebarNav } from '@/components/AppSidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function AppLayout() {
  const { isTrialing, trialEndsAt, role } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const showBanner = isTrialing && daysLeft !== null && daysLeft <= 3 && !dismissed;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebarNav />
      <div className="flex-1 overflow-hidden flex flex-col">
        {showBanner && (
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-destructive font-medium">
                {daysLeft === 0
                  ? 'Your free trial expires today!'
                  : `Your free trial expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`}
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
      </div>
    </div>
  );
}
