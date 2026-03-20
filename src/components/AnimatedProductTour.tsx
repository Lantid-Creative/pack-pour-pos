import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingCart, Package, PackageOpen, History, Users,
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, Plus, Minus, Check, Search,
  ChevronLeft, ChevronRight, Pause, Play, Percent, Warehouse, Banknote,
  CreditCard, ArrowRightLeft, Settings,
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
    caption: 'Get a real-time overview of your store — revenue, profit, sales count, average order value, and low-stock alerts all in one place.',
    highlights: ['5 key metric cards with trends', 'Revenue & Profit area chart', 'Payment method breakdown pie chart', 'Top products & cashier performance', 'Recent sales table'],
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
    id: 'sales',
    label: 'Sales History',
    icon: History,
    caption: 'View every transaction with filters by date, payment method, and cashier. Reprint receipts anytime.',
    highlights: ['Full transaction log', 'Date & payment filters', 'Receipt reprinting'],
  },
  {
    id: 'crates',
    label: 'Crate Management',
    icon: PackageOpen,
    caption: 'Track returnable crates, collect deposits on missing crates, and process refunds when customers return them.',
    highlights: ['Crate inventory overview', 'Pending deposit tracking', 'One-click returns'],
  },
  {
    id: 'staff',
    label: 'Staff & Roles',
    icon: Users,
    caption: 'Add cashiers and managers with role-based permissions. Control who can access what in your store.',
    highlights: ['Add staff accounts', 'Owner / Manager / Cashier roles', 'Custom permission toggles'],
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
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <div className="w-[120px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col shrink-0">
      <div className="h-8 flex items-center px-2 border-b border-sidebar-border">
        <div className="h-5 w-5 rounded bg-sidebar-primary flex items-center justify-center">
          <Package className="h-3 w-3 text-sidebar-primary-foreground" />
        </div>
        <span className="ml-1.5 text-[10px] font-bold">Pack & Pour</span>
      </div>
      <div className="flex-1 py-1 px-1 space-y-0.5">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] font-medium ${
              active === item.id
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/60'
            }`}
          >
            <item.icon className="h-2.5 w-2.5 shrink-0" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== DASHBOARD (faithful to real) =====================

function MockDashboard() {
  const metrics = [
    { label: 'Revenue (Today)', value: '₦284,500', icon: DollarSign, change: '+12.3%', positive: true },
    { label: 'Profit (Today)', value: '₦68,200', icon: Percent, change: '+8.1%', positive: true, sub: '24.0% margin' },
    { label: 'Sales (Today)', value: '23', icon: ShoppingCart, change: '+15.0%', positive: true },
    { label: 'Avg. Order Value', value: '₦12,370', icon: TrendingUp, change: '-3.2%', positive: false },
    { label: 'Low Stock Items', value: '3', icon: AlertTriangle, variant: 'warn' as const },
  ];

  // Inventory cards
  const inventoryCards = [
    { label: 'Inventory (Retail Value)', value: '₦1,847,200', icon: Warehouse, sub: '24 products · 1,432 units', accent: true },
    { label: 'Inventory (Cost Value)', value: '₦1,204,800', icon: DollarSign, sub: 'Potential profit: ₦642,400' },
    { label: 'Top Selling Pack', value: 'Coca-Cola 50cl', icon: TrendingUp, sub: '47 packs sold (today)' },
    { label: 'Cost of Goods Sold', value: '₦216,300', icon: Percent, sub: 'today · 23 transactions' },
  ];

  // Area chart data points (hourly for today)
  const hourlyPoints = [0, 12, 8, 24, 18, 42, 38, 55, 48, 65, 72, 60, 80, 75, 68, 58, 45, 30, 0, 0, 0, 0, 0, 0];
  const profitPoints = [0, 4, 2, 8, 5, 14, 12, 18, 15, 22, 24, 20, 28, 25, 22, 19, 14, 10, 0, 0, 0, 0, 0, 0];

  // Payment breakdown
  const payments = [
    { label: 'Cash', icon: Banknote, amount: '₦142,300' },
    { label: 'POS', icon: CreditCard, amount: '₦98,700' },
    { label: 'Transfer', icon: ArrowRightLeft, amount: '₦43,500' },
  ];

  // Top products
  const topProducts = [
    { name: 'Coca-Cola 50cl', qty: 47, revenue: '₦197.4k', margin: '28.5%' },
    { name: 'Star Lager', qty: 31, revenue: '₦167.4k', margin: '18.2%' },
    { name: 'Pepsi 50cl', qty: 28, revenue: '₦106.4k', margin: '22.1%' },
    { name: 'Guinness Stout', qty: 19, revenue: '₦114.0k', margin: '15.4%' },
  ];

  // Cashiers
  const cashiers = [
    { name: 'Chioma A.', initials: 'CA', sales: 12, revenue: '₦148,200', avg: '₦12,350' },
    { name: 'Emeka O.', initials: 'EO', sales: 8, revenue: '₦96,400', avg: '₦12,050' },
    { name: 'Bola T.', initials: 'BT', sales: 3, revenue: '₦39,900', avg: '₦13,300' },
  ];

  // Recent sales
  const recentSales = [
    { id: 'a3f2c1', date: '20/03/2026', cashier: 'Chioma A.', method: 'CASH', total: '₦18,400' },
    { id: 'b7d4e2', date: '20/03/2026', cashier: 'Emeka O.', method: 'POS', total: '₦12,600' },
    { id: 'c9e1a5', date: '20/03/2026', cashier: 'Chioma A.', method: 'TRANSFER', total: '₦24,200' },
    { id: 'd2f8b3', date: '20/03/2026', cashier: 'Bola T.', method: 'CASH', total: '₦8,900' },
  ];

  // Low stock items
  const lowStockItems = [
    { name: 'Pepsi 50cl', pack: 'Crate (24)', stock: 8 },
    { name: 'Fanta Orange', pack: 'Crate (24)', stock: 5 },
    { name: 'Star Lager', pack: 'Crate (12)', stock: 0 },
  ];

  return (
    <div className="p-2.5 space-y-2.5 overflow-hidden">
      {/* Header with time range */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-foreground">Dashboard</p>
          <p className="text-[7px] text-muted-foreground">Overview of your store performance</p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-0.5 p-0.5 rounded bg-muted"
        >
          {['Today', 'Week', 'Month', 'All', 'Custom'].map((r, i) => (
            <div key={r} className={`px-1.5 py-0.5 rounded text-[6px] font-medium ${i === 0 ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'}`}>
              {r}
            </div>
          ))}
        </motion.div>
      </div>

      {/* 5 Key Metrics Row */}
      <div className="grid grid-cols-5 gap-1.5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
            className={`rounded-lg p-1.5 border ${m.variant === 'warn' ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-border bg-card'}`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <div className={`h-4 w-4 rounded flex items-center justify-center ${m.variant === 'warn' ? 'bg-yellow-500/10' : 'bg-primary/10'}`}>
                <m.icon className={`h-2.5 w-2.5 ${m.variant === 'warn' ? 'text-yellow-600' : 'text-primary'}`} />
              </div>
            </div>
            <p className="text-[9px] font-bold text-foreground leading-tight">{m.value}</p>
            <p className="text-[6px] text-muted-foreground leading-tight mt-0.5">{m.label}</p>
            {m.sub && <p className="text-[5px] text-muted-foreground">{m.sub}</p>}
            {m.change && (
              <div className={`flex items-center gap-0.5 mt-0.5 ${m.positive ? 'text-green-500' : 'text-destructive'}`}>
                {m.positive ? <TrendingUp className="h-2 w-2" /> : <TrendingDown className="h-2 w-2" />}
                <span className="text-[5px] font-bold">{m.change} vs previous</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Inventory/Profit Cards Row */}
      <div className="grid grid-cols-4 gap-1.5">
        {inventoryCards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            className={`rounded-lg p-1.5 border ${c.accent ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <div className="h-3.5 w-3.5 rounded bg-primary/10 flex items-center justify-center">
                <c.icon className="h-2 w-2 text-primary" />
              </div>
              <p className="text-[5px] text-muted-foreground">{c.label}</p>
            </div>
            <p className="text-[8px] font-extrabold text-foreground">{c.value}</p>
            <p className="text-[5px] text-muted-foreground">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row: Area Chart + Payment Breakdown */}
      <div className="grid grid-cols-2 gap-1.5">
        {/* Revenue & Profit Area Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-card border border-border rounded-lg p-2"
        >
          <p className="text-[8px] font-semibold text-foreground mb-1">Hourly Revenue & Profit</p>
          <div className="relative h-[52px]">
            {/* Revenue area */}
            <svg viewBox="0 0 240 52" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
                d={`M ${hourlyPoints.map((p, i) => `${i * 10.4},${52 - p * 0.63}`).join(' L ')}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                d={`M 0,52 L ${hourlyPoints.map((p, i) => `${i * 10.4},${52 - p * 0.63}`).join(' L ')} L 239,52 Z`}
                fill="url(#revGrad)"
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.6, duration: 1.2, ease: 'easeOut' }}
                d={`M ${profitPoints.map((p, i) => `${i * 10.4},${52 - p * 1.6}`).join(' L ')}`}
                fill="none"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth="1.5"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2, duration: 0.5 }}
                d={`M 0,52 L ${profitPoints.map((p, i) => `${i * 10.4},${52 - p * 1.6}`).join(' L ')} L 239,52 Z`}
                fill="url(#profGrad)"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" /> Revenue</span>
            <span className="flex items-center gap-0.5 text-[5px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: 'hsl(142, 71%, 45%)' }} /> Profit</span>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="bg-card border border-border rounded-lg p-2"
        >
          <p className="text-[8px] font-semibold text-foreground mb-1.5">Payment Methods</p>
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            {payments.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + i * 0.1, duration: 0.3 }}
                className="p-1 rounded bg-muted/50 text-center"
              >
                <p.icon className="h-2.5 w-2.5 mx-auto mb-0.5 text-muted-foreground" />
                <p className="text-[5px] text-muted-foreground">{p.label}</p>
                <p className="text-[7px] font-bold text-foreground">{p.amount}</p>
              </motion.div>
            ))}
          </div>
          {/* Mini pie chart representation */}
          <div className="flex items-center justify-center gap-1">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <motion.circle
                initial={{ strokeDashoffset: 75.4 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                cx="18" cy="18" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="5"
                strokeDasharray="37.7 75.4" transform="rotate(-90 18 18)"
              />
              <motion.circle
                initial={{ strokeDashoffset: 75.4 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ delay: 2.2, duration: 0.6 }}
                cx="18" cy="18" r="12" fill="none" stroke="hsl(var(--accent))" strokeWidth="5"
                strokeDasharray="26.1 75.4" strokeDashoffset="-37.7" transform="rotate(-90 18 18)"
              />
              <motion.circle
                initial={{ strokeDashoffset: 75.4 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ delay: 2.4, duration: 0.4 }}
                cx="18" cy="18" r="12" fill="none" stroke="hsl(38, 92%, 50%)" strokeWidth="5"
                strokeDasharray="11.6 75.4" strokeDashoffset="-63.8" transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Top Products + Cashier Performance */}
      <div className="grid grid-cols-2 gap-1.5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }}
          className="bg-card border border-border rounded-lg p-2"
        >
          <p className="text-[8px] font-semibold text-foreground mb-1">Top Products — Revenue & Profit</p>
          <div className="space-y-1">
            {topProducts.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + i * 0.08, duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <div className="h-1 rounded-full bg-primary" style={{ width: `${Math.max(20, (p.qty / 47) * 100)}%`, maxWidth: '40px' }} />
                  <span className="text-[6px] text-foreground truncate">{p.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[5px] text-muted-foreground">{p.qty} sold</span>
                  <span className="text-[5px] font-bold text-green-500">{p.margin}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.4 }}
          className="bg-card border border-border rounded-lg p-2"
        >
          <p className="text-[8px] font-semibold text-foreground mb-1 flex items-center gap-0.5">
            <Users className="h-2.5 w-2.5 text-primary" /> Cashier Performance
          </p>
          <div className="space-y-1">
            {cashiers.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.6 + i * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-1 rounded bg-muted/30"
              >
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center text-[5px] font-bold text-primary">
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-[6px] font-medium text-foreground">{c.name}</p>
                    <p className="text-[5px] text-muted-foreground">{c.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[6px] font-bold text-foreground">{c.revenue}</p>
                  <p className="text-[5px] text-muted-foreground">Avg: {c.avg}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.4 }}
        className="border border-yellow-500/30 rounded-lg p-1.5"
      >
        <p className="text-[7px] font-semibold text-foreground flex items-center gap-0.5 mb-1">
          <AlertTriangle className="h-2.5 w-2.5 text-yellow-500" /> Low Stock Alerts
        </p>
        <div className="grid grid-cols-3 gap-1">
          {lowStockItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-1 rounded bg-yellow-500/5 border border-yellow-500/20">
              <div>
                <p className="text-[6px] font-medium text-foreground">{item.name}</p>
                <p className="text-[5px] text-muted-foreground">{item.pack}</p>
              </div>
              <span className="text-[7px] font-bold text-yellow-600">{item.stock}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Sales Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.4 }}
        className="bg-card border border-border rounded-lg p-2"
      >
        <p className="text-[8px] font-semibold text-foreground mb-1">Recent Sales</p>
        <table className="w-full text-[6px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-0.5 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-0.5 text-muted-foreground font-medium">Date</th>
              <th className="text-left py-0.5 text-muted-foreground font-medium">Cashier</th>
              <th className="text-left py-0.5 text-muted-foreground font-medium">Payment</th>
              <th className="text-right py-0.5 text-muted-foreground font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((s) => (
              <tr key={s.id} className="border-b border-border/50">
                <td className="py-0.5 font-mono">{s.id}</td>
                <td className="py-0.5">{s.date}</td>
                <td className="py-0.5">{s.cashier}</td>
                <td className="py-0.5 font-medium">{s.method}</td>
                <td className="py-0.5 text-right font-bold">{s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

// ===================== POS =====================

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
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-[110px] border-l border-border bg-card p-2 flex flex-col"
      >
        <p className="text-[9px] font-bold text-foreground mb-2">Cart (3 items)</p>
        <div className="flex-1 space-y-1.5">
          {cartItems.map(item => (
            <div key={item.name} className="border-b border-border pb-1">
              <p className="text-[8px] font-medium text-foreground truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center gap-0.5">
                  <div className="h-3.5 w-3.5 rounded bg-muted flex items-center justify-center"><Minus className="h-2 w-2" /></div>
                  <span className="text-[8px] font-bold w-4 text-center">{item.qty}</span>
                  <div className="h-3.5 w-3.5 rounded bg-muted flex items-center justify-center"><Plus className="h-2 w-2" /></div>
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

// ===================== INVENTORY =====================

function MockInventory() {
  const products = [
    { name: 'Coca-Cola 50cl', cat: 'Soft Drink', pack: 'Crate (24)', cost: '₦3,200', sell: '₦4,200', stock: 45, status: 'ok' },
    { name: 'Pepsi 50cl', cat: 'Soft Drink', pack: 'Crate (24)', cost: '₦2,900', sell: '₦3,800', stock: 8, status: 'low' },
    { name: 'Star Lager', cat: 'Beer', pack: 'Crate (12)', cost: '₦4,800', sell: '₦5,400', stock: 0, status: 'out' },
    { name: 'Guinness Stout', cat: 'Stout', pack: 'Crate (12)', cost: '₦5,200', sell: '₦6,000', stock: 22, status: 'ok' },
  ];
  const statusColors: Record<string, string> = {
    ok: 'bg-primary/10 text-primary', low: 'bg-yellow-500/10 text-yellow-600', out: 'bg-destructive/10 text-destructive',
  };
  const statusLabels: Record<string, string> = { ok: 'OK', low: 'Low', out: 'Out' };

  return (
    <div className="p-2.5 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-foreground">Inventory</p>
          <p className="text-[7px] text-muted-foreground">Manage stock levels, prices, and products</p>
        </div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex gap-1">
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
                <span className={`px-1 py-0.5 rounded-full text-[6px] font-bold ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
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

// ===================== SALES HISTORY =====================

function MockSalesHistory() {
  const sales = [
    { id: 'a3f2c1', date: '20/03/2026 14:32', cashier: 'Chioma A.', method: 'CASH', items: 4, total: '₦18,400' },
    { id: 'b7d4e2', date: '20/03/2026 13:15', cashier: 'Emeka O.', method: 'POS', items: 2, total: '₦12,600' },
    { id: 'c9e1a5', date: '20/03/2026 12:48', cashier: 'Chioma A.', method: 'TRANSFER', items: 6, total: '₦24,200' },
    { id: 'd2f8b3', date: '20/03/2026 11:22', cashier: 'Bola T.', method: 'CASH', items: 1, total: '₦8,900' },
    { id: 'e5a7c4', date: '20/03/2026 10:05', cashier: 'Emeka O.', method: 'CREDIT', items: 3, total: '₦15,600' },
  ];

  return (
    <div className="p-2.5 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-foreground">Sales History</p>
          <p className="text-[7px] text-muted-foreground">View all transactions, filter, and reprint receipts</p>
        </div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-1">
        <div className="flex-1 flex items-center gap-1 px-1.5 py-0.5 rounded border border-input bg-card text-[7px] text-muted-foreground">
          <Search className="h-2 w-2" /> Search by receipt ID...
        </div>
        <div className="px-1.5 py-0.5 rounded border border-border text-[7px] text-foreground">All Methods</div>
        <div className="px-1.5 py-0.5 rounded border border-border text-[7px] text-foreground">Today</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        <table className="w-full text-[7px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-1 px-1.5 text-muted-foreground font-medium">ID</th>
              <th className="text-left py-1 px-1.5 text-muted-foreground font-medium">Date & Time</th>
              <th className="text-left py-1 px-1.5 text-muted-foreground font-medium">Cashier</th>
              <th className="text-left py-1 px-1.5 text-muted-foreground font-medium">Method</th>
              <th className="text-center py-1 px-1.5 text-muted-foreground font-medium">Items</th>
              <th className="text-right py-1 px-1.5 text-muted-foreground font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="border-b border-border/50 hover:bg-muted/20"
              >
                <td className="py-1 px-1.5 font-mono">{s.id}</td>
                <td className="py-1 px-1.5">{s.date}</td>
                <td className="py-1 px-1.5">{s.cashier}</td>
                <td className="py-1 px-1.5">
                  <span className={`px-1 py-0.5 rounded text-[6px] font-bold ${
                    s.method === 'CASH' ? 'bg-primary/10 text-primary' :
                    s.method === 'POS' ? 'bg-accent/50 text-accent-foreground' :
                    s.method === 'CREDIT' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-muted text-muted-foreground'
                  }`}>{s.method}</span>
                </td>
                <td className="py-1 px-1.5 text-center">{s.items}</td>
                <td className="py-1 px-1.5 text-right font-bold">{s.total}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

// ===================== CRATES =====================

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
    <div className="p-2.5 space-y-2.5 overflow-hidden">
      <div>
        <p className="text-[10px] font-bold text-foreground">Crate Management</p>
        <p className="text-[7px] text-muted-foreground">Track deposits, returns, and inventory</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="bg-card border border-border rounded-lg p-2">
        <p className="text-[8px] font-semibold text-foreground mb-1.5 flex items-center gap-1">
          <Package className="h-2.5 w-2.5" /> Crate Inventory
        </p>
        <div className="grid grid-cols-2 gap-2">
          {inventory.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.15 }} className="border border-border rounded p-1.5">
              <p className="text-[8px] font-semibold text-foreground">{c.name}</p>
              <div className="grid grid-cols-3 gap-1 mt-1 text-center">
                <div><p className="text-[10px] font-bold text-foreground">{c.total}</p><p className="text-[5px] text-muted-foreground uppercase">Total</p></div>
                <div><p className="text-[10px] font-bold text-primary">{c.filled}</p><p className="text-[5px] text-muted-foreground uppercase">Filled</p></div>
                <div><p className="text-[10px] font-bold text-accent-foreground">{c.empty}</p><p className="text-[5px] text-muted-foreground uppercase">Empty</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="space-y-1">
        <p className="text-[8px] font-semibold text-foreground">Pending Deposits</p>
        {deposits.map((d, i) => (
          <div key={i} className="bg-card border border-yellow-500/30 rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold text-foreground">{d.product}</p>
              <p className="text-[6px] text-muted-foreground">{d.crates} crate{d.crates > 1 ? 's' : ''} owed · Deposit: {d.deposit}</p>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[7px] font-bold">Return</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ===================== STAFF & ROLES =====================

function MockStaff() {
  const staff = [
    { name: 'Chioma Adeyemi', initials: 'CA', email: 'chioma@store.ng', role: 'Manager', status: 'Active' },
    { name: 'Emeka Okonkwo', initials: 'EO', email: 'emeka@store.ng', role: 'Cashier', status: 'Active' },
    { name: 'Bola Taiwo', initials: 'BT', email: 'bola@store.ng', role: 'Cashier', status: 'Active' },
  ];
  const permissions = [
    { label: 'View Dashboard', manager: true, cashier: false },
    { label: 'Make Sales (POS)', manager: true, cashier: true },
    { label: 'Add/Remove Stock', manager: true, cashier: false },
    { label: 'View Sales History', manager: true, cashier: true },
    { label: 'Manage Staff', manager: false, cashier: false },
  ];

  return (
    <div className="p-2.5 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-foreground">Staff Management</p>
          <p className="text-[7px] text-muted-foreground">Manage team members and role permissions</p>
        </div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[7px] font-bold">+ Add Staff</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-2 border-b border-border pb-1">
        <span className="text-[8px] font-semibold text-primary border-b-2 border-primary pb-0.5">Staff List</span>
        <span className="text-[8px] text-muted-foreground pb-0.5">Permissions</span>
      </motion.div>

      {/* Staff list */}
      <div className="space-y-1">
        {staff.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-card border border-border rounded-lg p-2 flex items-center gap-2"
          >
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[7px] font-bold text-primary">
              {s.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[8px] font-semibold text-foreground">{s.name}</p>
              <p className="text-[6px] text-muted-foreground">{s.email}</p>
            </div>
            <span className={`px-1 py-0.5 rounded text-[6px] font-bold ${s.role === 'Manager' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{s.role}</span>
            <span className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 text-[6px] font-bold">{s.status}</span>
          </motion.div>
        ))}
      </div>

      {/* Permission preview */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-card border border-border rounded-lg p-2"
      >
        <p className="text-[7px] font-semibold text-foreground mb-1">Role Permissions Preview</p>
        <table className="w-full text-[6px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-0.5 text-muted-foreground">Permission</th>
              <th className="text-center py-0.5 text-muted-foreground">Manager</th>
              <th className="text-center py-0.5 text-muted-foreground">Cashier</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.label} className="border-b border-border/50">
                <td className="py-0.5 text-foreground">{p.label}</td>
                <td className="py-0.5 text-center">{p.manager ? <Check className="h-2 w-2 text-green-500 mx-auto" /> : <Minus className="h-2 w-2 text-muted-foreground mx-auto" />}</td>
                <td className="py-0.5 text-center">{p.cashier ? <Check className="h-2 w-2 text-green-500 mx-auto" /> : <Minus className="h-2 w-2 text-muted-foreground mx-auto" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

// ===================== MAIN TOUR =====================

const screenComponents: Record<string, React.FC> = {
  dashboard: MockDashboard,
  pos: MockPOS,
  inventory: MockInventory,
  sales: MockSalesHistory,
  crates: MockCrates,
  staff: MockStaff,
};

export function AnimatedProductTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const screen = tourScreens[activeIndex];
  const ScreenComponent = screenComponents[screen.id];

  // Auto-advance every 8 seconds (longer for dashboard)
  useEffect(() => {
    if (paused) return;
    const duration = screen.id === 'dashboard' ? 10000 : 7000;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % tourScreens.length);
    }, duration);
    return () => clearInterval(timer);
  }, [paused, screen.id]);

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
      <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-1 overflow-x-auto">
        {tourScreens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
              i === activeIndex
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <s.icon className="h-3 w-3" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Mock app */}
      <div className="flex" style={{ height: '380px' }}>
        <MockSidebar active={screen.id} />
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ScreenComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Caption & progress */}
      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <screen.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{screen.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{screen.caption}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {tourScreens.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
