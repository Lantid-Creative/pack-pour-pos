import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Package, ShoppingCart, BarChart3, Users, Shield, Printer, CreditCard,
  ArrowRight, Check, Zap, Star, Play, Eye, PackageOpen, TrendingUp,
  ChevronRight, Menu, X,
} from 'lucide-react';
import { AnimatedProductTour } from '@/components/AnimatedProductTour';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const features = [
  {
    id: 'pos',
    icon: ShoppingCart,
    label: 'Point of Sale',
    title: 'Sell faster with a POS built for wholesale',
    desc: 'Large product tiles, instant search, and one-tap checkout. Accept cash, POS, or bank transfer. Split payments across methods. Built for speed in busy warehouses.',
    highlights: ['Tap-to-add product grid', 'Multi-method split payments', 'Instant receipt printing', 'Works on any device'],
  },
  {
    id: 'inventory',
    icon: Package,
    label: 'Inventory',
    title: 'Never run out of stock again',
    desc: 'Track every product in real-time. Get low-stock alerts before you run out. Log restocking with a single click. Set bulk pricing tiers automatically.',
    highlights: ['Real-time stock levels', 'Low-stock alerts', 'Bulk price tiers', 'Cost & margin tracking'],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    title: 'See your business at a glance',
    desc: 'Revenue, profit margins, top products, cashier performance, and payment breakdowns — all on one dashboard. Filter by day, week, month, or custom range.',
    highlights: ['Revenue & profit charts', 'Payment method breakdown', 'Cashier performance', 'Export reports'],
  },
  {
    id: 'staff',
    icon: Users,
    label: 'Staff & Roles',
    title: 'Control who sees what',
    desc: 'Create Owner, Manager, and Cashier accounts. Each role sees only what they need. Customize permissions per role. Track every action by every staff member.',
    highlights: ['3-tier role system', 'Custom permissions', 'Activity tracking', 'Secure staff logins'],
  },
  {
    id: 'crates',
    icon: PackageOpen,
    label: 'Crate Management',
    title: 'Track every crate, every deposit',
    desc: 'Unique to wholesale drinks: manage returnable crates, collect deposits on missing ones, and process refunds when customers bring them back.',
    highlights: ['Crate inventory tracking', 'Automatic deposit calculation', 'Return processing', 'Customer crate history'],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('pos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    try {
      await supabase.functions.invoke('seed-demo');
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@lantid.store',
        password: 'Demo#login#to#$TORE',
      });
      if (error) {
        toast.error('Demo login failed. Please try again.');
      } else {
        navigate('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <div className="min-h-screen bg-landing-bg text-landing-fg overflow-x-hidden">
      {/* ─── NAV ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full z-50 bg-landing-bg/80 backdrop-blur-2xl border-b border-landing-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-landing-purple flex items-center justify-center shadow-lg shadow-landing-purple/25">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Lantid</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-landing-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#video" className="hover:text-white transition-colors">See It Work</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => navigate('/how-to')} className="hover:text-white transition-colors">Guide</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-landing-muted hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-landing-purple text-white hover:bg-landing-purple-hover active:scale-[0.97] transition-all shadow-md shadow-landing-purple/20">
              Get Started
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-landing-card border-b border-landing-border px-6 py-4 space-y-3"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-landing-muted hover:text-white">Features</a>
            <a href="#video" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-landing-muted hover:text-white">See It Work</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-landing-muted hover:text-white">Pricing</a>
            <div className="pt-3 border-t border-landing-border flex gap-3">
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-sm text-landing-muted">Sign In</button>
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="px-4 py-2 text-sm font-semibold rounded-lg bg-landing-purple text-white">Get Started</button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-8 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-landing-purple/12 rounded-full blur-[200px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-sm font-medium mb-8">
              <Zap className="h-3.5 w-3.5" /> Built for Nigerian wholesale drink sellers
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight">
              Run your drink{' '}
              <br className="hidden md:block" />
              business,{' '}
              <span className="bg-gradient-to-r from-landing-purple-light via-landing-purple to-landing-purple-light bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_3s_ease-in-out_infinite]">
                effortlessly
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg md:text-xl text-landing-muted max-w-2xl mx-auto leading-relaxed">
              The all-in-one POS system for wholesale beverages. Track sales, manage inventory,
              control staff, print receipts — all from one place.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="group px-8 py-4 rounded-2xl bg-landing-purple text-white font-bold text-base hover:bg-landing-purple-hover active:scale-[0.97] transition-all flex items-center gap-2 shadow-xl shadow-landing-purple/30"
              >
                Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleTryDemo}
                disabled={demoLoading}
                className="group px-8 py-4 rounded-2xl border border-landing-border bg-landing-card/50 text-white font-semibold text-base hover:bg-landing-card hover:border-landing-purple/30 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Eye className="h-4 w-4 text-landing-purple-light" /> {demoLoading ? 'Loading Demo...' : 'Try Live Demo'}
              </button>
            </motion.div>

            <motion.p variants={fadeUp} custom={4} className="mt-5 text-xs text-landing-muted/60">
              No credit card required · 14-day free trial · Setup in 3 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── PRODUCT PREVIEW (Interactive Tour) ─── */}
      <section className="px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-6xl mx-auto relative"
        >
          <div className="rounded-2xl border border-landing-border/60 bg-landing-card/30 p-1 shadow-2xl shadow-black/40">
            <AnimatedProductTour />
          </div>
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-landing-bg to-transparent pointer-events-none rounded-b-2xl" />
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-16 border-y border-landing-border/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Active Stores' },
              { value: '₦2B+', label: 'Sales Processed' },
              { value: '99.9%', label: 'Uptime' },
              { value: '30+', label: 'Drink Brands Supported' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-extrabold text-white font-mono-numbers">{stat.value}</p>
                <p className="text-sm text-landing-muted mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VIDEO SECTION (Square-style full-width showcase) ─── */}
      <section id="video" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white">
              See Lantid in action
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted max-w-xl mx-auto">
              Watch how wholesalers use Lantid to manage their entire drink business from a single dashboard.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden border border-landing-border/50 bg-landing-card shadow-2xl shadow-black/40 group"
          >
            {/* Video player */}
            <div className="relative aspect-video bg-landing-bg">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster=""
                playsInline
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
              >
                {/* Replace src with your rendered video URL */}
                <source src="/lantid-walkthrough.mp4" type="video/mp4" />
              </video>

              {/* Play overlay */}
              {!videoPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-landing-bg/60 cursor-pointer"
                  onClick={handlePlayVideo}
                >
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-landing-purple flex items-center justify-center shadow-2xl shadow-landing-purple/40 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-white ml-1" />
                  </div>
                  <p className="absolute bottom-8 text-sm text-landing-muted font-medium">Watch the 60-second walkthrough</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES: Tabbed Explorer (Square-style "click into place") ─── */}
      <section id="features" className="py-24 px-6 bg-landing-card/30 border-y border-landing-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
              Features
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white">
              Everything clicks{' '}
              <span className="text-landing-purple-light">into place</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-landing-muted max-w-2xl mx-auto">
              Purpose-built for wholesale drink sellers. No complexity, just results.
            </motion.p>
          </motion.div>

          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeFeature === f.id
                    ? 'bg-landing-purple text-white shadow-lg shadow-landing-purple/25'
                    : 'bg-landing-card/50 text-landing-muted border border-landing-border/50 hover:border-landing-purple/30 hover:text-white'
                }`}
              >
                <f.icon className="h-4 w-4" />
                {f.label}
              </button>
            ))}
          </div>

          {/* Feature content */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text side */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {currentFeature.title}
              </h3>
              <p className="text-base text-landing-muted leading-relaxed mb-8">
                {currentFeature.desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentFeature.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 p-3 rounded-xl bg-landing-card/50 border border-landing-border/40">
                    <div className="h-6 w-6 rounded-lg bg-landing-purple/10 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 text-landing-purple-light" />
                    </div>
                    <span className="text-sm text-white font-medium">{h}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/login')}
                className="mt-8 inline-flex items-center gap-2 text-landing-purple-light font-semibold hover:underline"
              >
                Get started with {currentFeature.label} <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Visual side — interactive tour */}
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl border border-landing-border/40 bg-landing-card/30 p-1 shadow-xl shadow-black/30">
                <AnimatedProductTour />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-extrabold text-white">
              Up and running in <span className="text-landing-purple-light">3 minutes</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-landing-purple/20 via-landing-purple/40 to-landing-purple/20" />

            {[
              { step: '01', title: 'Create Your Store', desc: 'Sign up, name your store, and we auto-populate 30+ Nigerian drink products for you.' },
              { step: '02', title: 'Add Your Staff', desc: 'Create cashier and manager accounts with role-based permissions. They log in with their own credentials.' },
              { step: '03', title: 'Start Selling', desc: 'Your POS is ready. Tap products, choose payment method, checkout, and print receipt.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center relative">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-landing-purple/10 border-2 border-landing-purple/20 mb-6 relative z-10">
                  <span className="text-2xl font-black text-landing-purple-light font-mono-numbers">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-landing-muted leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6 bg-landing-card/30 border-y border-landing-border/40">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-extrabold text-white">
              Simple, transparent <span className="text-landing-purple-light">pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted">No hidden fees. Cancel anytime.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter', price: '₦5,000', period: '/month',
                desc: 'Perfect for single-location stores',
                features: ['1 Store', 'Owner Only', 'POS & Receipts', 'Basic Analytics', 'Email Support'],
                popular: false,
              },
              {
                name: 'Business', price: '₦15,000', period: '/month',
                desc: 'For growing wholesale businesses',
                features: ['1 Store', 'Unlimited Staff', 'Full Analytics', 'Inventory Management', 'Priority Support', 'Export Reports'],
                popular: true,
              },
              {
                name: 'Enterprise', price: 'Custom', period: '',
                desc: 'For chains and distributors',
                features: ['Multiple Stores', 'Unlimited Everything', 'API Access', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'],
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-landing-purple bg-gradient-to-b from-landing-purple/10 to-landing-card shadow-2xl shadow-landing-purple/15 scale-[1.03]'
                    : 'border-landing-border/50 bg-landing-card/50 hover:border-landing-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-landing-purple text-white text-xs font-bold shadow-lg shadow-landing-purple/30">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-landing-muted mt-1">{plan.desc}</p>
                <div className="mt-6 mb-8">
                  <span className="text-4xl font-black text-white font-mono-numbers">{plan.price}</span>
                  <span className="text-sm text-landing-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-landing-muted">
                      <div className="h-5 w-5 rounded-full bg-landing-purple/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-landing-purple-light" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] ${
                    plan.popular
                      ? 'bg-landing-purple text-white hover:bg-landing-purple-hover shadow-lg shadow-landing-purple/25'
                      : 'border border-landing-border text-white hover:bg-white/5'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-extrabold text-white">
              Trusted by <span className="text-landing-purple-light">wholesalers</span> across Nigeria
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Chief Okafor', store: 'Okafor Drinks, Onitsha', text: 'Before Lantid, my cashiers used notebooks. Now I can see every sale from my phone. Game changer!' },
              { name: 'Mrs. Adebayo', store: 'Ade Wholesale, Lagos', text: 'The inventory alerts alone have saved me from stock-outs three times this month. Worth every naira.' },
              { name: 'Alhaji Musa', store: 'Musa & Sons, Kano', text: 'I manage 4 staff from one dashboard. The role system means my cashiers can\'t touch inventory settings.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="p-7 rounded-3xl border border-landing-border/50 bg-landing-card/40 hover:border-landing-border transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="h-4 w-4 fill-landing-purple-light text-landing-purple-light" />))}
                </div>
                <p className="text-sm text-landing-muted leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-landing-purple/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-landing-purple-light">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-landing-muted">{t.store}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-landing-purple/5 via-landing-purple/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-landing-purple/10 rounded-full blur-[180px] pointer-events-none" />

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center relative">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Ready to grow your{' '}
            <span className="text-landing-purple-light">drink business?</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-5 text-lg text-landing-muted">
            Join hundreds of Nigerian wholesale stores already using Lantid.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="group px-10 py-4 rounded-2xl bg-landing-purple text-white font-bold text-lg hover:bg-landing-purple-hover active:scale-[0.97] transition-all shadow-xl shadow-landing-purple/30 flex items-center gap-2"
            >
              Start Your Free Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleTryDemo}
              disabled={demoLoading}
              className="group px-8 py-4 rounded-2xl border border-landing-border bg-landing-card/50 text-white font-semibold text-base hover:bg-landing-card hover:border-landing-purple/30 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Eye className="h-4 w-4 text-landing-purple-light" /> {demoLoading ? 'Loading...' : 'Try Live Demo'}
            </button>
          </motion.div>
          <motion.p variants={fadeUp} custom={3} className="mt-5 text-xs text-landing-muted/60">
            No credit card required · Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-landing-border/40 py-12 px-6 bg-landing-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-landing-purple flex items-center justify-center shadow-md shadow-landing-purple/20">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">Lantid</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-landing-muted">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="https://www.lantid.store" className="hover:text-white transition-colors">lantid.store</a>
            </div>
            <p className="text-xs text-landing-muted/60">© 2026 Lantid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
