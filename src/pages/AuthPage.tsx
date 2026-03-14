import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) { setError(error); setSubmitting(false); return; }
    } else {
      if (!fullName.trim()) { setError('Full name is required'); setSubmitting(false); return; }
      const { error } = await signUp(email, password, fullName);
      if (error) { setError(error); setSubmitting(false); return; }
    }
    setSubmitting(false);
    // Auth state change will redirect
  };

  return (
    <div className="min-h-screen bg-landing-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-landing-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-landing-purple mb-3">
            <Package className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">BulkDrink POS</h1>
          <p className="text-sm text-landing-muted">Wholesale Drinks Management System</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          {/* Toggle */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 text-sm font-semibold rounded-md transition-all ${mode === 'signup' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              Create Store
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {submitting ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account & Store'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-xs text-center text-muted-foreground">
              Staff? Your store owner creates your account.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
