import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, CreditCard, Banknote, ArrowRightLeft, AlertTriangle, Warehouse, Calendar, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

type TimeRange = 'today' | 'week' | 'month' | 'all';

function getDateRange(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case 'today':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case 'month': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    case 'all':
      return null;
  }
}

function getPreviousDateRange(range: TimeRange): { start: Date | null; end: Date } {
  const now = new Date();
  switch (range) {
    case 'today': {
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const start = new Date(end);
      start.setDate(start.getDate() - 1);
      return { start, end };
    }
    case 'week': {
      const end = new Date(now);
      end.setDate(end.getDate() - 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      return { start, end };
    }
    case 'month': {
      const end = new Date(now);
      end.setMonth(end.getMonth() - 1);
      const start = new Date(end);
      start.setMonth(start.getMonth() - 1);
      return { start, end };
    }
    case 'all':
      return { start: null, end: new Date(0) };
  }
}

export default function DashboardPage() {
  const { storeId, role } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('today');

  const { data: allSales = [] } = useQuery({
    queryKey: ['sales', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*)')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('products').select('*').eq('store_id', storeId);
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  // Filter sales by time range
  const sales = useMemo(() => {
    const rangeStart = getDateRange(timeRange);
    if (!rangeStart) return allSales;
    return allSales.filter((s: any) => new Date(s.created_at) >= rangeStart);
  }, [allSales, timeRange]);

  // Previous period sales for comparison
  const prevSales = useMemo(() => {
    const { start, end } = getPreviousDateRange(timeRange);
    if (!start) return [];
    return allSales.filter((s: any) => {
      const d = new Date(s.created_at);
      return d >= start && d < end;
    });
  }, [allSales, timeRange]);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const prevRevenue = prevSales.reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const cashSales = sales.filter((s: any) => s.payment_method === 'cash');
    const posSales = sales.filter((s: any) => s.payment_method === 'pos');
    const transferSales = sales.filter((s: any) => s.payment_method === 'transfer');

    // Profit calculation from sale_items
    let totalCOGS = 0;
    let prevCOGS = 0;
    const productCounts: Record<string, number> = {};

    sales.forEach((sale: any) =>
      (sale.sale_items || []).forEach((item: any) => {
        productCounts[item.product_name] = (productCounts[item.product_name] || 0) + item.quantity;
        totalCOGS += item.quantity * Number(item.cost_price || 0);
      })
    );

    prevSales.forEach((sale: any) =>
      (sale.sale_items || []).forEach((item: any) => {
        prevCOGS += item.quantity * Number(item.cost_price || 0);
      })
    );

    const totalProfit = totalRevenue - totalCOGS;
    const prevProfit = prevRevenue - prevCOGS;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const profitChange = prevProfit > 0 ? ((totalProfit - prevProfit) / prevProfit) * 100 : 0;

    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
    const lowStock = products.filter((p: any) => p.stock <= p.low_stock_threshold);

    // Inventory values
    const inventoryRetailValue = products.reduce((sum: number, p: any) => sum + (p.stock * Number(p.price)), 0);
    const inventoryCostValue = products.reduce((sum: number, p: any) => sum + (p.stock * Number(p.cost_price || 0)), 0);
    const inventoryProfit = inventoryRetailValue - inventoryCostValue;
    const totalProducts = products.length;
    const totalUnits = products.reduce((sum: number, p: any) => sum + p.stock, 0);

    // Revenue change percentage
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const salesCountChange = prevSales.length > 0 ? ((sales.length - prevSales.length) / prevSales.length) * 100 : 0;

    // Average order value
    const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
    const prevAvgOrder = prevSales.length > 0 ? prevRevenue / prevSales.length : 0;
    const avgOrderChange = prevAvgOrder > 0 ? ((avgOrderValue - prevAvgOrder) / prevAvgOrder) * 100 : 0;

    return {
      totalSales: sales.length,
      totalRevenue,
      totalCOGS,
      totalProfit,
      profitMargin,
      profitChange,
      prevRevenue,
      revenueChange,
      salesCountChange,
      cashRevenue: cashSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
      posRevenue: posSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
      transferRevenue: transferSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
      topProduct: topProduct ? topProduct[0] : 'N/A',
      topProductQty: topProduct ? topProduct[1] : 0,
      lowStock,
      inventoryRetailValue,
      inventoryCostValue,
      inventoryProfit,
      totalProducts,
      totalUnits,
      avgOrderValue,
      avgOrderChange,
    };
  }, [sales, prevSales, products]);

  const paymentData = [
    { name: 'Cash', value: stats.cashRevenue, color: 'hsl(var(--primary))' },
    { name: 'POS', value: stats.posRevenue, color: 'hsl(var(--accent))' },
    { name: 'Transfer', value: stats.transferRevenue, color: 'hsl(38, 92%, 50%)' },
  ];

  // Build chart data based on time range
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const salesForChart = timeRange === 'today' ? sales : sales.slice(0, 100);

    salesForChart.forEach((s: any) => {
      let key: string;
      if (timeRange === 'today') {
        key = new Date(s.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
      } else {
        key = new Date(s.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
      }
      grouped[key] = (grouped[key] || 0) + Number(s.total);
    });
    return Object.entries(grouped).map(([label, total]) => ({ label, total })).reverse();
  }, [sales, timeRange]);

  // Top 5 selling products
  const topProducts = useMemo(() => {
    const counts: Record<string, { qty: number; revenue: number }> = {};
    sales.forEach((sale: any) =>
      (sale.sale_items || []).forEach((item: any) => {
        if (!counts[item.product_name]) counts[item.product_name] = { qty: 0, revenue: 0 };
        counts[item.product_name].qty += item.quantity;
        counts[item.product_name].revenue += item.quantity * Number(item.unit_price);
      })
    );
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  // Hourly breakdown for today
  const hourlyData = useMemo(() => {
    if (timeRange !== 'today') return [];
    const hours: Record<number, number> = {};
    sales.forEach((s: any) => {
      const h = new Date(s.created_at).getHours();
      hours[h] = (hours[h] || 0) + Number(s.total);
    });
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      total: hours[i] || 0,
    }));
  }, [sales, timeRange]);

  const rangeLabels: Record<TimeRange, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
    all: 'All Time',
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your store performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {(['today', 'week', 'month', 'all'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === r
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {rangeLabels[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={DollarSign}
          label={`Revenue (${rangeLabels[timeRange]})`}
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          change={timeRange !== 'all' ? stats.revenueChange : undefined}
          isMoney
        />
        <MetricCard
          icon={Percent}
          label={`Profit (${rangeLabels[timeRange]})`}
          value={`₦${stats.totalProfit.toLocaleString()}`}
          change={timeRange !== 'all' ? stats.profitChange : undefined}
          isMoney
          sub={`${stats.profitMargin.toFixed(1)}% margin`}
        />
        <MetricCard
          icon={ShoppingCart}
          label={`Sales (${rangeLabels[timeRange]})`}
          value={stats.totalSales.toString()}
          change={timeRange !== 'all' ? stats.salesCountChange : undefined}
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg. Order Value"
          value={`₦${Math.round(stats.avgOrderValue).toLocaleString()}`}
          change={timeRange !== 'all' ? stats.avgOrderChange : undefined}
          isMoney
        />
        <MetricCard
          icon={Package}
          label="Low Stock Items"
          value={stats.lowStock.length.toString()}
          variant={stats.lowStock.length > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Profit & Inventory Cards (Owner/Manager only) */}
      {(role === 'owner' || role === 'manager') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Warehouse className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Inventory (Retail Value)</p>
            </div>
            <p className="text-2xl font-extrabold font-mono-numbers text-foreground">₦{stats.inventoryRetailValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalProducts} products · {stats.totalUnits.toLocaleString()} units</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Inventory (Cost Value)</p>
            </div>
            <p className="text-2xl font-extrabold font-mono-numbers text-foreground">₦{stats.inventoryCostValue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Potential profit: ₦{stats.inventoryProfit.toLocaleString()}</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Top Selling Pack</p>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.topProduct}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.topProductQty} packs sold ({rangeLabels[timeRange].toLowerCase()})</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Cost of Goods Sold</p>
            </div>
            <p className="text-xl font-bold font-mono-numbers text-foreground">₦{stats.totalCOGS.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{rangeLabels[timeRange].toLowerCase()} · {stats.totalSales} transactions</p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-foreground">
            {timeRange === 'today' ? 'Hourly Revenue' : 'Revenue Trend'}
          </h3>
          {(timeRange === 'today' ? hourlyData : chartData).length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeRange === 'today' ? hourlyData : chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey={timeRange === 'today' ? 'hour' : 'label'} fontSize={10} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis fontSize={10} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fill="url(#revenueGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              No sales data for this period.
            </div>
          )}
        </div>

        {/* Payment Breakdown */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-foreground">Payment Methods</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <PaymentCard icon={Banknote} label="Cash" amount={stats.cashRevenue} />
            <PaymentCard icon={CreditCard} label="POS" amount={stats.posRevenue} />
            <PaymentCard icon={ArrowRightLeft} label="Transfer" amount={stats.transferRevenue} />
          </div>
          {stats.totalRevenue > 0 && (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {paymentData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table (Owner/Manager) */}
      {(role === 'owner' || role === 'manager') && topProducts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4 text-foreground">Top Selling Products ({rangeLabels[timeRange]})</h3>
          <div className="space-y-2">
            {topProducts.map((p, i) => {
              const maxRevenue = topProducts[0]?.revenue || 1;
              return (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5 text-right font-bold">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                      <span className="text-sm font-mono-numbers font-bold text-foreground">₦{p.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.qty} packs sold</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Low Stock Alerts */}
      {stats.lowStock.length > 0 && (
        <div className="bg-card border border-warning/30 rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> Low Stock Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 rounded-md bg-warning/5 border border-warning/20">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.pack_size}</p>
                </div>
                <span className="font-mono-numbers text-sm font-bold text-warning">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales Table */}
      {(role === 'manager' || role === 'owner') && sales.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-3 text-foreground">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Cashier</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 10).map((sale: any) => (
                  <tr key={sale.id} className="border-b border-border/50">
                    <td className="py-2 font-mono-numbers text-xs">{sale.id.slice(-6)}</td>
                    <td className="py-2">{new Date(sale.created_at).toLocaleDateString('en-NG')}</td>
                    <td className="py-2">{sale.cashier_name}</td>
                    <td className="py-2 uppercase text-xs font-medium">{sale.payment_method}</td>
                    <td className="py-2 text-right font-mono-numbers font-bold">₦{Number(sale.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, change, variant = 'default', isMoney, sub }: {
  icon: React.ElementType; label: string; value: string; change?: number; variant?: 'default' | 'warning'; isMoney?: boolean; sub?: string;
}) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <div className={`p-4 rounded-xl border ${variant === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${variant === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${variant === 'warning' ? 'text-warning' : 'text-primary'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className={`text-lg font-bold ${isMoney ? 'font-mono-numbers' : ''}`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
      {change !== undefined && change !== 0 && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-500' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? '+' : ''}{change.toFixed(1)}% vs previous period
        </div>
      )}
    </div>
  );
}

function PaymentCard({ icon: Icon, label, amount }: { icon: React.ElementType; label: string; amount: number }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 text-center">
      <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono-numbers text-sm font-bold">₦{amount.toLocaleString()}</p>
    </div>
  );
}
