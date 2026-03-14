import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, BarChart3, Users, Shield, Printer, CreditCard, ArrowRight, Check, Zap, Globe, Star } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-landing-bg text-landing-fg overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-landing-bg/80 backdrop-blur-xl border-b border-landing-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-landing-purple flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">BulkDrink</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-landing-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-landing-muted hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-landing-purple text-white hover:bg-landing-purple-hover active:scale-[0.97] transition-all">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Glow effect */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-landing-purple/20 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-landing-purple/10 border border-landing-purple/20 text-landing-purple-light text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" /> Built for Nigerian wholesale drink sellers
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Sell Drinks in Bulk.{' '}
              <span className="bg-gradient-to-r from-landing-purple-light to-landing-purple bg-clip-text text-transparent">
                Manage Everything.
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg md:text-xl text-landing-muted max-w-2xl mx-auto leading-relaxed">
              The all-in-one POS system for wholesale beverage businesses. Track sales, manage inventory, 
              control staff access, and print receipts — all from one powerful dashboard.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="px-8 py-3.5 rounded-xl bg-landing-purple text-white font-bold text-base hover:bg-landing-purple-hover active:scale-[0.97] transition-all flex items-center gap-2 shadow-lg shadow-landing-purple/25">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#features" className="px-8 py-3.5 rounded-xl border border-landing-border text-landing-muted font-semibold text-base hover:bg-white/5 transition-all">
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-landing-bg via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={heroDashboard}
              alt="BulkDrink POS Dashboard"
              className="w-full max-w-4xl mx-auto rounded-2xl border border-landing-border shadow-2xl shadow-landing-purple/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-landing-border bg-landing-card">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Active Stores' },
            { value: '₦2B+', label: 'Sales Processed' },
            { value: '99.9%', label: 'Uptime' },
            { value: '30+', label: 'Drink Brands' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white font-mono-numbers">{stat.value}</p>
              <p className="text-sm text-landing-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-bold text-white">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-landing-purple-light to-landing-purple bg-clip-text text-transparent">
                Run Your Business
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted max-w-2xl mx-auto">
              Purpose-built for wholesale drink sellers. No complexity, just results.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ShoppingCart, title: 'Lightning-Fast POS', desc: 'Large product tiles, instant search, and one-tap checkout. Built for speed in busy warehouses.' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'See total sales, top-selling packs, payment method breakdown, and revenue trends at a glance.' },
              { icon: Users, title: 'Role-Based Access', desc: 'Owner, Manager, and Cashier portals — each sees only what they need. Full control, zero confusion.' },
              { icon: Package, title: 'Inventory Management', desc: 'Track stock levels, get low-stock alerts, and log restocking with a single click.' },
              { icon: Printer, title: 'Receipt Printing', desc: 'Professional thermal-style receipts ready to print. Shows pack details, quantities, and totals.' },
              { icon: CreditCard, title: '3-Way Payment', desc: 'Accept Cash, POS, or Bank Transfer. Toggle between payment methods with a single tap at checkout.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-xl border border-landing-border bg-landing-card hover:border-landing-purple/40 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-lg bg-landing-purple/10 flex items-center justify-center mb-4 group-hover:bg-landing-purple/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-landing-purple-light" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-landing-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-landing-card border-y border-landing-border">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white">
              Up and Running in <span className="text-landing-purple-light">3 Minutes</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Store', desc: 'Sign up, name your store, and we auto-populate 30+ Nigerian drink products.' },
              { step: '02', title: 'Add Your Staff', desc: 'Create cashier and manager accounts. They log in with their own credentials.' },
              { step: '03', title: 'Start Selling', desc: 'Your POS is ready. Tap products, choose payment method, checkout, print receipt.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="text-5xl font-black text-landing-purple/30 font-mono-numbers mb-3">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-landing-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white">
              Simple, Transparent <span className="text-landing-purple-light">Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted">No hidden fees. Cancel anytime.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '₦5,000',
                period: '/month',
                desc: 'Perfect for single-location stores',
                features: ['1 Store', 'Up to 3 Staff', 'POS & Receipts', 'Basic Analytics', 'Email Support'],
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
                className={`relative p-6 rounded-xl border ${
                  plan.popular
                    ? 'border-landing-purple bg-gradient-to-b from-landing-purple/10 to-landing-card shadow-xl shadow-landing-purple/10'
                    : 'border-landing-border bg-landing-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-landing-purple text-white text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-landing-muted mt-1">{plan.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-white font-mono-numbers">{plan.price}</span>
                  <span className="text-sm text-landing-muted">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-landing-muted">
                      <Check className="h-4 w-4 text-landing-purple-light flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all active:scale-[0.97] ${
                    plan.popular
                      ? 'bg-landing-purple text-white hover:bg-landing-purple-hover'
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
      <section id="testimonials" className="py-24 px-6 bg-landing-card border-y border-landing-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
            Trusted by <span className="text-landing-purple-light">Wholesalers</span> Across Nigeria
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Chief Okafor', store: 'Okafor Drinks, Onitsha', text: 'Before BulkDrink, my cashiers used notebooks. Now I can see every sale from my phone. Game changer!' },
              { name: 'Mrs. Adebayo', store: 'Ade Wholesale, Lagos', text: 'The inventory alerts alone have saved me from stock-outs three times this month. Worth every naira.' },
              { name: 'Alhaji Musa', store: 'Musa & Sons, Kano', text: 'I manage 4 staff from one dashboard. The role system means my cashiers can\'t touch inventory settings.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="p-6 rounded-xl border border-landing-border bg-landing-bg">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="h-4 w-4 fill-landing-purple-light text-landing-purple-light" />))}
                </div>
                <p className="text-sm text-landing-muted leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-landing-muted">{t.store}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-landing-purple/5 to-transparent pointer-events-none" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center relative">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-white">
            Ready to Grow Your <span className="text-landing-purple-light">Drink Business?</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="mt-4 text-lg text-landing-muted">
            Join hundreds of Nigerian wholesale stores already using BulkDrink POS.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="mt-8">
            <button onClick={() => navigate('/login')} className="px-10 py-4 rounded-xl bg-landing-purple text-white font-bold text-lg hover:bg-landing-purple-hover active:scale-[0.97] transition-all shadow-lg shadow-landing-purple/25 flex items-center gap-2 mx-auto">
              Start Your Free Trial <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-landing-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-landing-purple flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">BulkDrink POS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-landing-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <p className="text-xs text-landing-muted">© 2026 BulkDrink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
