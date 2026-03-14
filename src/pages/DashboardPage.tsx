import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Package, CreditCard, Banknote, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { storeId, role } = useAuth();

  const { data: sales = [] } = useQuery({
    queryKey: ['sales', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*)')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(100);
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

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const cashSales = sales.filter((s: any) => s.payment_method === 'cash');
    const posSales = sales.filter((s: any) => s.payment_method === 'pos');
    const transferSales = sales.filter((s: any) => s.payment_method === 'transfer');

    const productCounts: Record<string, number> = {};
    sales.forEach((sale: any) =>
      (sale.sale_items || []).forEach((item: any) => {
        productCounts[item.product_name] = (productCounts[item.product_name] || 0) + item.quantity;
      })
    );
    const topProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
    const lowStock = products.filter((p: any) => p.stock <= p.low_stock_threshold);

    return {
      totalSales: sales.length,
      totalRevenue,
      cashRevenue: cashSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
      posRevenue: posSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
      transferRevenue: transferSales.reduce((s: number, sale: any) => s + Number(sale.total), 0),
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
    const grouped: Record<string, number> = {};
    sales.slice(0, 50).forEach((s: any) => {
      const date = new Date(s.created_at).toLocaleDateString('en-NG');
      grouped[date] = (grouped[date] || 0) + Number(s.total);
    });
    return Object.entries(grouped).map(([date, total]) => ({ date, total })).reverse();
  }, [sales]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Sales" value={stats.totalSales.toString()} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} isMoney />
        <StatCard icon={TrendingUp} label="Top Selling Pack" value={stats.topProduct} sub={`${stats.topProductQty} packs sold`} />
        <StatCard icon={Package} label="Low Stock Items" value={stats.lowStock.length.toString()} variant={stats.lowStock.length > 0 ? 'warning' : 'default'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    {paymentData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

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

      {stats.lowStock.length > 0 && (
        <div className="bg-card border border-warning/30 rounded-lg p-5">
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

      {(role === 'manager' || role === 'owner') && sales.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
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
