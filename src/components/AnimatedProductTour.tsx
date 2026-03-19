import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, PackageOpen, History, Users,
  TrendingUp, DollarSign, AlertTriangle, Plus, Minus, Check, Search,
  ChevronLeft, ChevronRight, Pause, Play,
} from 'lucide-react';

interface TourScreen {
  id: string;
  label: string;
  icon: React.ElementType;
  caption: string;
  highlights: string[];
}

const tourScreens: TourScreen[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    caption: 'Get a real-time overview of your store — revenue, profit, sales count, and low-stock alerts all in one place.',
    highlights: ['Revenue & Profit metrics', 'Sales charts', 'Low stock warnings'],
  },
  {
    id: 'pos',
    label: 'POS Terminal',
    icon: ShoppingCart,
    caption: 'Tap products, adjust quantities, select payment method, and checkout in seconds. Works on desktop and mobile.',
    highlights: ['Product grid with search', 'Cart with live total', 'Multiple payment methods'],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    caption: 'Track every product — stock levels, cost & selling prices, margins, and get alerts when stock runs low.',
    highlights: ['Add/Remove stock instantly', 'Price tiers for bulk', 'Crate product support'],
  },
  {
    id: 'crates',
    label: 'Crate Management',
    icon: PackageOpen,
    caption: 'Track returnable crates, collect deposits on missing crates, and process refunds when customers return them.',
    highlights: ['Crate inventory overview', 'Pending deposit tracking', 'One-click returns'],
  },
];

// --- Mock UI Components ---

function MockSidebar({ active }: { active: string }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales History', icon: History },
    { id: 'crates', label: 'Crates', icon: PackageOpen },
    { id: 'staff', label: 'Staff', icon: Users },
  ];
  return (
    <div className="w-36 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0">
      <div className="h-8 flex items-center px-2 border-b border-sidebar-border">
        <div className="h-5 w-5 rounded bg-sidebar-primary flex items-center justify-center">
          <Package className="h-3 w-3 text-sidebar-primary-foreground" />
        </div>
        <span className="ml-1.5 text-[10px] font-bold">Lantid</span>
      </div>
      <div className="flex-1 py-1 px-1 space-y-0.5">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[9px] font-medium ${
              active === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/60'
            }`}
          >
            <item.icon className="h-3 w-3 shrink-0" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockDashboard() {
  const metrics = [
    { label: 'Revenue (Today)', value: '₦284,500', icon: DollarSign, change: '+12%' },
    { label: 'Profit', value: '₦68,200', icon: TrendingUp, change: '+8%' },
    { label: 'Sales', value: '23', icon: ShoppingCart, change: '+5' },
    { label: 'Low Stock', value: '3', icon: AlertTriangle, variant: 'warn' as const },
  ];
  const chartBars = [65, 45, 80, 55, 90, 70, 85];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-3 space-y-3 overflow-hidden">
      <div>
        <p className="text-[11px] font-bold text-foreground">Dashboard</p>
        <p className="text-[8px] text-muted-foreground">Overview of your store performance</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            className="bg-card border border-border rounded-lg p-2"
          >
            <div className="flex items-center gap-1 mb-1">
              <div className={`h-4 w-4 rounded flex items-center justify-center ${m.variant === 'warn' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                <m.icon className={`h-2.5 w-2.5 ${m.variant === 'warn' ? 'text-destructive' : 'text-primary'}`} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-foreground">{m.value}</p>
            <p className="text-[7px] text-muted-foreground">{m.label}</p>
            {m.change && <p className="text-[7px] text-primary font-bold mt-0.5">{m.change}</p>}
          </motion.div>
        ))}
      </div>
      {/* Mini chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-card border border-border rounded-lg p-2"
      >
        <p className="text-[8px] font-semibold text-foreground mb-2">Weekly Revenue</p>
        <div className="flex items-end gap-1 h-16">
          {chartBars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 1.2 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className="flex-1 bg-primary/80 rounded-t"
            />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {days.map(d => (
            <p key={d} className="flex-1 text-center text-[6px] text-muted-foreground">{d}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MockPOS() {
  const products = [
    { name: 'Coca-Cola 50cl', price: '₦4,200', pack: 'Crate (24)' },
    { name: 'Pepsi 50cl', price: '₦3,800', pack: 'Crate (24)' },
    { name: 'Amstel Malta', price: '₦1,800', pack: 'Pack (6)' },
    { name: 'Star Lager', price: '₦5,400', pack: 'Crate (12)' },
    { name: 'Fanta Orange', price: '₦3,600', pack: 'Crate (24)' },
    { name: 'Guinness Stout', price: '₦6,000', pack: 'Crate (12)' },
  ];
  const cartItems = [
    { name: 'Coca-Cola 50cl', qty: 2, price: '₦8,400' },
    { name: 'Star Lager', qty: 1, price: '₦5,400' },
  ];

  return (
    <div className="flex h-full">
      {/* Products */}
      <div className="flex-1 p-2 space-y-2 overflow-hidden">
        <div className="flex items-center gap-1">
          <div className="flex-1 flex items-center gap-1 px-1.5 py-1 rounded border border-input bg-card text-[8px] text-muted-foreground">
            <Search className="h-2.5 w-2.5" /> Search products...
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
              className="bg-card border border-border rounded-lg p-1.5 cursor-pointer hover:border-primary/50"
            >
              <p className="text-[8px] font-semibold text-foreground truncate">{p.name}</p>
              <p className="text-[7px] text-muted-foreground">{p.pack}</p>
              <p className="text-[9px] font-bold text-primary mt-0.5">{p.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Cart */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-32 border-l border-border bg-card p-2 flex flex-col"
      >
        <p className="text-[9px] font-bold text-foreground mb-2">Cart (3 items)</p>
        <div className="flex-1 space-y-1.5">
          {cartItems.map(item => (
            <div key={item.name} className="border-b border-border pb-1">
              <p className="text-[8px] font-medium text-foreground truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center gap-0.5">
                  <div className="h-3.5 w-3.5 rounded bg-muted flex items-center justify-center">
                    <Minus className="h-2 w-2" />
                  </div>
                  <span className="text-[8px] font-bold w-4 text-center">{item.qty}</span>
                  <div className="h-3.5 w-3.5 rounded bg-muted flex items-center justify-center">
                    <Plus className="h-2 w-2" />
                  </div>
                </div>
                <span className="text-[8px] font-bold text-foreground">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-2 border-t border-border">
          <div className="flex justify-between text-[9px] font-bold text-foreground mb-1.5">
            <span>Total</span><span>₦13,800</span>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 1] }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="bg-primary text-primary-foreground rounded-md py-1 text-center text-[8px] font-bold"
          >
            Complete Sale
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function MockInventory() {
  const products = [
    { name: 'Coca-Cola 50cl', cat: 'Soft Drink', pack: 'Crate (24)', cost: '₦3,200', sell: '₦4,200', stock: 45, status: 'ok' },
    { name: 'Pepsi 50cl', cat: 'Soft Drink', pack: 'Crate (24)', cost: '₦2,900', sell: '₦3,800', stock: 8, status: 'low' },
    { name: 'Star Lager', cat: 'Beer', pack: 'Crate (12)', cost: '₦4,800', sell: '₦5,400', stock: 0, status: 'out' },
    { name: 'Guinness Stout', cat: 'Stout', pack: 'Crate (12)', cost: '₦5,200', sell: '₦6,000', stock: 22, status: 'ok' },
  ];
  const statusColors: Record<string, string> = {
    ok: 'bg-primary/10 text-primary',
    low: 'bg-yellow-500/10 text-yellow-600',
    out: 'bg-destructive/10 text-destructive',
  };
  const statusLabels: Record<string, string> = { ok: 'OK', low: 'Low', out: 'Out' };

  return (
    <div className="p-3 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-foreground">Inventory</p>
          <p className="text-[8px] text-muted-foreground">Manage stock levels, prices, and products</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex gap-1"
        >
          <div className="px-1.5 py-0.5 rounded border border-primary text-primary text-[7px] font-bold">Library</div>
          <div className="px-1.5 py-0.5 rounded border border-border text-foreground text-[7px] font-bold">Create</div>
        </motion.div>
      </div>
      <div className="space-y-1.5">
        {products.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.35 }}
            className="bg-card border border-border rounded-lg p-2 flex items-center gap-2"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-[9px] font-semibold text-foreground truncate">{p.name}</p>
                <span className={`px-1 py-0.5 rounded-full text-[6px] font-bold ${statusColors[p.status]}`}>
                  {statusLabels[p.status]}
                </span>
              </div>
              <p className="text-[7px] text-muted-foreground">{p.cat} · {p.pack}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[8px] text-muted-foreground">Cost: {p.cost} · Sell: {p.sell}</p>
              <p className="text-[10px] font-bold text-foreground">{p.stock} units</p>
            </div>
            <div className="flex gap-0.5 shrink-0">
              <div className="px-1 py-0.5 rounded bg-primary/10 text-primary text-[6px] font-bold">+ Add</div>
              <div className="px-1 py-0.5 rounded bg-destructive/10 text-destructive text-[6px] font-bold">− Remove</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MockCrates() {
  const inventory = [
    { name: 'Coca-Cola 50cl', total: 60, filled: 45, empty: 15 },
    { name: 'Star Lager', total: 30, filled: 22, empty: 8 },
  ];
  const deposits = [
    { product: 'Coca-Cola 50cl', crates: 2, deposit: '₦2,000', status: 'pending' },
    { product: 'Star Lager', crates: 1, deposit: '₦1,500', status: 'pending' },
  ];

  return (
    <div className="p-3 space-y-3 overflow-hidden">
      <div>
        <p className="text-[11px] font-bold text-foreground">Crate Management</p>
        <p className="text-[8px] text-muted-foreground">Track deposits, returns, and inventory</p>
      </div>
      {/* Crate inventory */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-card border border-border rounded-lg p-2"
      >
        <p className="text-[9px] font-semibold text-foreground mb-2 flex items-center gap-1">
          <Package className="h-3 w-3" /> Crate Inventory
        </p>
        <div className="grid grid-cols-2 gap-2">
          {inventory.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
              className="border border-border rounded p-1.5"
            >
              <p className="text-[8px] font-semibold text-foreground">{c.name}</p>
              <div className="grid grid-cols-3 gap-1 mt-1 text-center">
                <div>
                  <p className="text-[10px] font-bold text-foreground">{c.total}</p>
                  <p className="text-[6px] text-muted-foreground uppercase">Total</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary">{c.filled}</p>
                  <p className="text-[6px] text-muted-foreground uppercase">Filled</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-accent-foreground">{c.empty}</p>
                  <p className="text-[6px] text-muted-foreground uppercase">Empty</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Pending deposits */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="space-y-1"
      >
        <p className="text-[9px] font-semibold text-foreground">Pending Deposits</p>
        {deposits.map((d, i) => (
          <div key={i} className="bg-card border border-yellow-500/30 rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold text-foreground">{d.product}</p>
              <p className="text-[7px] text-muted-foreground">{d.crates} crate{d.crates > 1 ? 's' : ''} owed · Deposit: {d.deposit}</p>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[7px] font-bold">Return</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const screenComponents: Record<string, React.FC> = {
  dashboard: MockDashboard,
  pos: MockPOS,
  inventory: MockInventory,
  crates: MockCrates,
};

export function AnimatedProductTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const screen = tourScreens[activeIndex];
  const ScreenComponent = screenComponents[screen.id];

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % tourScreens.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      {/* Tour header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-destructive/60" />
            <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
            <div className="h-2 w-2 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs font-semibold text-foreground ml-2">Live Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveIndex(prev => (prev - 1 + tourScreens.length) % tourScreens.length)}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPaused(!paused)}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
          <button
            onClick={() => setActiveIndex(prev => (prev + 1) % tourScreens.length)}
            className="h-6 w-6 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Screen tabs */}
      <div className="px-4 py-2 border-b border-border flex gap-1 overflow-x-auto">
        {tourScreens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              i === activeIndex
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <s.icon className="h-3.5 w-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Mock screen */}
      <div className="flex h-[320px] sm:h-[360px] bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen.id}
            className="flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MockSidebar active={screen.id} />
            <div className="flex-1 overflow-hidden">
              <ScreenComponent />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption & highlights */}
      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <p className="text-sm font-medium text-foreground">{screen.caption}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {screen.highlights.map(h => (
            <span key={h} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Check className="h-3 w-3" /> {h}
            </span>
          ))}
        </div>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {tourScreens.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all ${
                i === activeIndex ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
