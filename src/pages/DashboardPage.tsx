import { useAppStore } from '@/lib/store';
import { useMemo } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Package, CreditCard, Banknote, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { sales, products, currentRole } = useAppStore();

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
    const cashSales = sales.filter((s) => s.paymentMethod === 'cash');
    const posSales = sales.filter((s) => s.paymentMethod === 'pos');
    const transferSales = sales.filter((s) => s.paymentMethod === 'transfer');

    // Top product
    const productCounts: Record<string, number> = {};
    sales.forEach((sale) =>
      sale.items.forEach((item) => {
        productCounts[item.product.name] = (productCounts[item.product.name] || 0) + item.quantity;
      })
    );
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];

    // Low stock products
    const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);

    return {
      totalSales: sales.length,
      totalRevenue,
      cashRevenue: cashSales.reduce((s, sale) => s + sale.total, 0),
      posRevenue: posSales.reduce((s, sale) => s + sale.total, 0),
      transferRevenue: transferSales.reduce((s, sale) => s + sale.total, 0),
      topProduct: topProduct ? topProduct[0] : 'N/A',
      topProductQty: topProduct ? topProduct[1] : 0,
      lowStock,
    };
  }, [sales, products]);

  const paymentData = [
    { name: 'Cash', value: stats.cashRevenue, color: 'hsl(160, 84%, 39%)' },
    { name: 'POS', value: stats.posRevenue, color: 'hsl(215, 28%, 17%)' },
    { name: 'Transfer', value: stats.transferRevenue, color: 'hsl(38, 92%, 50%)' },
  ];

  const recentSalesData = useMemo(() => {
    const last7 = sales.slice(0, 20);
    const grouped: Record<string, number> = {};
    last7.forEach((s) => {
      grouped[s.date] = (grouped[s.date] || 0) + s.total;
    });
    return Object.entries(grouped).map(([date, total]) => ({ date, total })).reverse();
  }, [sales]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Sales" value={stats.totalSales.toString()} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} isMoney />
        <StatCard icon={TrendingUp} label="Top Selling Pack" value={stats.topProduct} sub={`${stats.topProductQty} packs sold`} />
        <StatCard icon={Package} label="Low Stock Items" value={stats.lowStock.length.toString()} variant={stats.lowStock.length > 0 ? 'warning' : 'default'} />
      </div>

      {/* Payment Breakdown + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-lg p-5">
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
                    {paymentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Sales Chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-4 text-foreground">Sales Trend</h3>
          {recentSalesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recentSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  <Bar dataKey="total" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              No sales data yet. Complete sales to see trends.
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock.length > 0 && (
        <div className="bg-card border border-warning/30 rounded-lg p-5">
          <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" /> Low Stock Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 rounded-md bg-warning/5 border border-warning/20">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.packSize}</p>
                </div>
                <span className="font-mono-numbers text-sm font-bold text-warning">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales Table - visible to manager/owner */}
      {(currentRole === 'manager' || currentRole === 'owner') && sales.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3 text-foreground">Recent Sales</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Cashier</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Items</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="border-b border-border/50">
                    <td className="py-2 font-mono-numbers text-xs">{sale.id.slice(-6)}</td>
                    <td className="py-2">{sale.date}</td>
                    <td className="py-2">{sale.cashier}</td>
                    <td className="py-2">{sale.items.length} items</td>
                    <td className="py-2 uppercase text-xs font-medium">{sale.paymentMethod}</td>
                    <td className="py-2 text-right font-mono-numbers font-bold">₦{sale.total.toLocaleString()}</td>
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

function StatCard({ icon: Icon, label, value, sub, variant = 'default', isMoney }: {
  icon: React.ElementType; label: string; value: string; sub?: string; variant?: 'default' | 'warning'; isMoney?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${variant === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${variant === 'warning' ? 'bg-warning/10' : 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${variant === 'warning' ? 'text-warning' : 'text-primary'}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-lg font-bold ${isMoney ? 'font-mono-numbers' : ''}`}>{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function PaymentCard({ icon: Icon, label, amount }: { icon: React.ElementType; label: string; amount: number }) {
  return (
    <div className="p-3 rounded-md bg-muted/50 text-center">
      <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono-numbers text-sm font-bold">₦{amount.toLocaleString()}</p>
    </div>
  );
}
