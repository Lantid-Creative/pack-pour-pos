import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, ArrowLeft, ShoppingCart, BarChart3, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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
      if (!phone.trim()) { setError('Phone number is required'); setSubmitting(false); return; }
      const { error } = await signUp(email, password, fullName, phone);
      if (error) { setError(error); setSubmitting(false); return; }
    }
    setSubmitting(false);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-landing-border bg-landing-bg/50 text-white placeholder:text-landing-muted/60 focus:outline-none focus:ring-2 focus:ring-landing-purple/50 focus:border-landing-purple/50 transition-all text-sm";

  const features = [
    { icon: ShoppingCart, text: 'Lightning-fast POS built for wholesale' },
    { icon: BarChart3, text: 'Real-time sales & inventory analytics' },
    { icon: Shield, text: 'Role-based access for your entire team' },
  ];

  return (
    <div className="min-h-screen bg-landing-bg flex">
      {/* Left panel - branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-10 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-landing-purple/15 via-landing-bg to-landing-bg" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-landing-purple/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-landing-muted hover:text-white transition-colors mb-16">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-landing-purple flex items-center justify-center shadow-lg shadow-landing-purple/30">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Lantid POS</h1>
              <p className="text-sm text-landing-muted">Wholesale Drinks Management</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-6">
            {mode === 'login'
              ? 'Welcome back to your dashboard.'
              : 'Start managing your store today.'}
          </h2>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="h-9 w-9 rounded-lg bg-landing-purple/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4 text-landing-purple-light" />
                </div>
                <span className="text-sm text-landing-muted">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-5 rounded-xl border border-landing-border/40 bg-landing-card/40 backdrop-blur-sm">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-3 w-3 text-landing-purple-light">★</div>
              ))}
            </div>
            <p className="text-sm text-landing-muted leading-relaxed mb-3">
              "Before Lantid, my cashiers used notebooks. Now I can see every sale from my phone."
            </p>
            <p className="text-xs text-white font-semibold">Chief Okafor · Okafor Drinks, Onitsha</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-landing-purple/8 rounded-full blur-[120px] pointer-events-none lg:hidden" />

        {/* Mobile back button */}
        <button onClick={() => navigate('/')} className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-sm text-landing-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-landing-purple mb-3 shadow-lg shadow-landing-purple/25">
              <Package className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Lantid POS</h1>
            <p className="text-sm text-landing-muted">Wholesale Drinks Management System</p>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Sign in to your account' : 'Create your store'}
            </h2>
            <p className="text-sm text-landing-muted mt-1">
              {mode === 'login'
                ? 'Enter your credentials to access your dashboard'
                : 'Set up your store and start selling in minutes'}
            </p>
          </div>

          <div className="bg-landing-card/60 backdrop-blur-sm rounded-2xl border border-landing-border/50 p-7 space-y-5">
            {/* Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-landing-bg/60 rounded-xl">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'login' ? 'bg-landing-purple text-white shadow-md shadow-landing-purple/20' : 'text-landing-muted hover:text-white'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${mode === 'signup' ? 'bg-landing-purple text-white shadow-md shadow-landing-purple/20' : 'text-landing-muted hover:text-white'}`}
              >
                Create Store
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="text-sm font-medium text-white mb-1.5 block">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-1.5 block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 08012345678"
                        className={inputClass}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="text-sm font-medium text-white mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputClass}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-landing-purple text-white font-bold text-sm hover:bg-landing-purple-hover active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg shadow-landing-purple/20"
              >
                {submitting ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account & Store'}
              </button>
            </form>

            {mode === 'login' && (
              <p className="text-xs text-center text-landing-muted pt-1">
                Staff member? Your store owner creates your account.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
