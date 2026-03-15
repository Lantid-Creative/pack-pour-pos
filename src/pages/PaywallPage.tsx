import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CreditCard, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaywallPage() {
  const { role, trialEndsAt, signOut } = useAuth();
  const navigate = useNavigate();

  const isOwner = role === 'owner';

  return (
    <div className="min-h-screen bg-landing-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-destructive/10 rounded-full blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-destructive/20 mb-3">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-white">Subscription Required</h1>
          <p className="text-sm text-landing-muted mt-2">
            {trialEndsAt
              ? `Your free trial ended on ${trialEndsAt.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}.`
              : 'Your subscription has expired.'}
          </p>
        </div>

        <div className="bg-landing-card rounded-xl border border-landing-border p-6 space-y-4">
          {isOwner ? (
            <>
              <p className="text-sm text-landing-muted text-center">
                Choose a plan to continue using Lantid POS for your store and staff.
              </p>
              <button
                onClick={() => navigate('/subscription')}
                className="w-full py-3 rounded-lg bg-landing-purple text-white font-bold text-sm hover:bg-landing-purple-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Choose a Plan
              </button>
            </>
          ) : (
            <p className="text-sm text-landing-muted text-center">
              Your store owner needs to subscribe to a plan before you can continue using Lantid POS. Please contact your store owner.
            </p>
          )}

          <button
            onClick={() => signOut()}
            className="w-full py-3 rounded-lg border border-landing-border text-landing-muted text-sm font-medium hover:text-white hover:border-landing-border/80 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
