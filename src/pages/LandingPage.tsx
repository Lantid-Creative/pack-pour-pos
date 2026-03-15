import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Package, ShoppingCart, BarChart3, Users, Shield, Printer, CreditCard, ArrowRight, Check, Zap, Globe, Star, ChevronRight, Play, MousePointer, Eye } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const handleTryDemo = async () => {
    setDemoLoading(true);
    try {
      // Seed demo data (idempotent)
      await supabase.functions.invoke('seed-demo');
      // Log in as demo user
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@lantid.store',
        password: 'Demo#login#to#$TORE',
      });
      if (error) {
        toast.error('Demo login failed. Please try again.');
        console.error(error);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-landing-bg text-landing-fg overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="fixed top-0 w-full z-50 bg-landing-bg/70 backdrop-blur-2xl border-b border-landing-border/50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-landing-purple flex items-center justify-center shadow-lg shadow-landing-purple/25">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Lantid</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-landing-muted">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-landing-muted hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-landing-purple text-white hover:bg-landing-purple-hover active:scale-[0.97] transition-all shadow-md shadow-landing-purple/20">
              Get Started Free
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-28 pb-4 px-6 relative min-h-[90vh] flex flex-col">
        {/* Glow effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-landing-purple/15 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-landing-purple/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative flex-1 flex flex-col">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-sm font-medium mb-8">
              <Zap className="h-3.5 w-3.5" /> Built for Nigerian wholesale drink sellers
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
              Sell Drinks in Bulk.{' '}
              <span className="bg-gradient-to-r from-landing-purple-light via-landing-purple to-landing-purple-light bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_3s_ease-in-out_infinite]">
                Manage Everything.
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg md:text-xl text-landing-muted max-w-2xl mx-auto leading-relaxed">
              The all-in-one POS system for wholesale beverage businesses. Track sales, manage inventory,
              control staff access, and print receipts — all from one powerful dashboard.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="group px-8 py-3.5 rounded-xl bg-landing-purple text-white font-bold text-base hover:bg-landing-purple-hover active:scale-[0.97] transition-all flex items-center gap-2 shadow-xl shadow-landing-purple/30">
                Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleTryDemo}
                disabled={demoLoading}
                className="group px-8 py-3.5 rounded-xl border border-landing-purple/40 bg-landing-purple/10 text-landing-purple-light font-semibold text-base hover:bg-landing-purple/20 hover:border-landing-purple/60 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Eye className="h-4 w-4" /> {demoLoading ? 'Loading Demo...' : 'Try Live Demo'}
              </button>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-4 text-xs text-landing-muted/70">
              No credit card required · 14-day free trial · Setup in 3 minutes
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="mt-12 relative mx-auto w-full max-w-5xl"
          >
            {/* Browser chrome */}
            <div className="rounded-xl border border-landing-border/60 bg-landing-card/80 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-landing-border/40 bg-landing-bg/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-landing-bg/60 border border-landing-border/30 text-xs text-landing-muted font-mono">
                    lantid.store/dashboard
                  </div>
                </div>
              </div>
              {/* Screenshot */}
              <img
                src={heroDashboard}
                alt="Lantid POS Dashboard showing sales analytics, inventory management and real-time metrics"
                className="w-full"
                loading="eager"
              />
            </div>

            {/* Floating accent cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -left-4 md:-left-8 top-1/3 bg-landing-card border border-landing-border rounded-lg p-3 shadow-xl shadow-black/30 hidden md:flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-landing-muted">Today's Revenue</p>
                <p className="text-sm font-bold text-white font-mono-numbers">₦847,500</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -right-4 md:-right-8 top-1/2 bg-landing-card border border-landing-border rounded-lg p-3 shadow-xl shadow-black/30 hidden md:flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-landing-purple/20 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-landing-purple-light" />
              </div>
              <div>
                <p className="text-xs text-landing-muted">Sales Today</p>
                <p className="text-sm font-bold text-white font-mono-numbers">127 orders</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By / Stats */}
      <section className="py-16 border-y border-landing-border/50 bg-landing-card/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-sm text-landing-muted mb-8 uppercase tracking-widest font-medium">Trusted by wholesalers across Nigeria</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Active Stores' },
              { value: '₦2B+', label: 'Sales Processed' },
              { value: '99.9%', label: 'Uptime' },
              { value: '30+', label: 'Drink Brands' },
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
                <p className="text-3xl md:text-4xl font-bold text-white font-mono-numbers">{stat.value}</p>
                <p className="text-sm text-landing-muted mt-1.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
              Features
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold text-white">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-landing-purple-light to-landing-purple bg-clip-text text-transparent">
                Run Your Business
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-landing-muted max-w-2xl mx-auto">
              Purpose-built for wholesale drink sellers. No complexity, just results.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShoppingCart, title: 'Lightning-Fast POS', desc: 'Large product tiles, instant search, and one-tap checkout. Built for speed in busy warehouses.', color: 'bg-landing-purple/10', iconColor: 'text-landing-purple-light' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'See total sales, top-selling packs, payment method breakdown, and revenue trends at a glance.', color: 'bg-success/10', iconColor: 'text-success' },
              { icon: Users, title: 'Role-Based Access', desc: 'Owner, Manager, and Cashier portals — each sees only what they need. Full control, zero confusion.', color: 'bg-warning/10', iconColor: 'text-warning' },
              { icon: Package, title: 'Inventory Management', desc: 'Track stock levels, get low-stock alerts, and log restocking with a single click.', color: 'bg-landing-purple/10', iconColor: 'text-landing-purple-light' },
              { icon: Printer, title: 'Receipt Printing', desc: 'Professional thermal-style receipts ready to print. Supports 58mm, 80mm, and A4 printers.', color: 'bg-success/10', iconColor: 'text-success' },
              { icon: CreditCard, title: '3-Way Payment', desc: 'Accept Cash, POS, or Bank Transfer. Toggle between payment methods with a single tap at checkout.', color: 'bg-warning/10', iconColor: 'text-warning' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group relative p-6 rounded-2xl border border-landing-border/60 bg-landing-card/50 hover:border-landing-purple/30 hover:bg-landing-card transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-5.5 w-5.5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-landing-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-landing-card/50 border-y border-landing-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
              How It Works
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold text-white">
              Up and Running in <span className="text-landing-purple-light">3 Minutes</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-landing-purple/30 via-landing-purple/50 to-landing-purple/30" />

            {[
              { step: '01', title: 'Create Your Store', desc: 'Sign up, name your store, and we auto-populate 30+ Nigerian drink products for you.' },
              { step: '02', title: 'Add Your Staff', desc: 'Create cashier and manager accounts with role-based permissions. They log in with their own credentials.' },
              { step: '03', title: 'Start Selling', desc: 'Your POS is ready. Tap products, choose payment method, checkout, and print receipt.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center relative">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-landing-purple/10 border-2 border-landing-purple/30 mb-4 relative z-10">
                  <span className="text-xl font-black text-landing-purple-light font-mono-numbers">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-landing-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
              Pricing
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold text-white">
              Simple, Transparent <span className="text-landing-purple-light">Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-lg text-landing-muted">No hidden fees. Cancel anytime.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '₦5,000',
                period: '/month',
                desc: 'Perfect for single-location stores',
                features: ['1 Store', 'Owner Only (No Staff)', 'POS & Receipts', 'Basic Analytics', 'Email Support'],
                popular: false,
              },
              {
                name: 'Business',
                price: '₦15,000',
                period: '/month',
                desc: 'For growing wholesale businesses',
                features: ['1 Store', 'Unlimited Staff', 'Full Analytics', 'Inventory Management', 'Priority Support', 'Export Reports'],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
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
                className={`relative p-7 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-landing-purple bg-gradient-to-b from-landing-purple/10 to-landing-card shadow-2xl shadow-landing-purple/15 scale-[1.02]'
                    : 'border-landing-border/60 bg-landing-card/50 hover:border-landing-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-landing-purple text-white text-xs font-bold shadow-lg shadow-landing-purple/30">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-landing-muted mt-1">{plan.desc}</p>
                <div className="mt-5 mb-6">
                  <span className="text-4xl font-black text-white font-mono-numbers">{plan.price}</span>
                  <span className="text-sm text-landing-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-landing-muted">
                      <div className="h-5 w-5 rounded-full bg-landing-purple/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-landing-purple-light" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] ${
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

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-landing-card/50 border-y border-landing-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-xs font-semibold uppercase tracking-wider mb-4">
              Testimonials
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold text-white">
              Trusted by <span className="text-landing-purple-light">Wholesalers</span> Across Nigeria
            </motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Chief Okafor', store: 'Okafor Drinks, Onitsha', text: 'Before Lantid, my cashiers used notebooks. Now I can see every sale from my phone. Game changer!' },
              { name: 'Mrs. Adebayo', store: 'Ade Wholesale, Lagos', text: 'The inventory alerts alone have saved me from stock-outs three times this month. Worth every naira.' },
              { name: 'Alhaji Musa', store: 'Musa & Sons, Kano', text: 'I manage 4 staff from one dashboard. The role system means my cashiers can\'t touch inventory settings.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="p-6 rounded-2xl border border-landing-border/60 bg-landing-bg/80 hover:border-landing-border transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="h-4 w-4 fill-landing-purple-light text-landing-purple-light" />))}
                </div>
                <p className="text-sm text-landing-muted leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-landing-purple/20 flex items-center justify-center">
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

      {/* CTA */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-landing-purple/5 via-landing-purple/10 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-landing-purple/10 rounded-full blur-[150px] pointer-events-none" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center relative">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white">
            Ready to Grow Your <span className="text-landing-purple-light">Drink Business?</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted">
            Join hundreds of Nigerian wholesale stores already using BulkDrink POS.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/login')} className="group px-10 py-4 rounded-xl bg-landing-purple text-white font-bold text-lg hover:bg-landing-purple-hover active:scale-[0.97] transition-all shadow-xl shadow-landing-purple/30 flex items-center gap-2">
              Start Your Free Trial <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleTryDemo}
              disabled={demoLoading}
              className="group px-8 py-3.5 rounded-xl border border-landing-purple/40 bg-landing-purple/10 text-landing-purple-light font-semibold text-base hover:bg-landing-purple/20 hover:border-landing-purple/60 active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" /> {demoLoading ? 'Loading...' : 'Try Live Demo'}
            </button>
          </motion.div>
          <motion.p variants={fadeUp} custom={3} className="mt-4 text-xs text-landing-muted/70">
            No credit card required · Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-landing-border/50 py-12 px-6 bg-landing-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-landing-purple flex items-center justify-center shadow-md shadow-landing-purple/20">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">BulkDrink POS</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-landing-muted">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            </div>
            <p className="text-xs text-landing-muted/70">© 2026 BulkDrink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
