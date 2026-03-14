import { useAppStore } from '@/lib/store';

export default function SalesHistoryPage() {
  const { sales } = useAppStore();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sales History</h1>
        <p className="text-sm text-muted-foreground">View all completed transactions</p>
      </div>

      {sales.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No sales yet</p>
          <p className="text-sm">Completed transactions will appear here</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Sale ID</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cashier</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Items</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-mono-numbers text-xs font-medium">{sale.id.slice(-6)}</td>
                  <td className="py-3 px-4">{sale.date}</td>
                  <td className="py-3 px-4">{sale.cashier}</td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      {sale.items.map((item, i) => (
                        <div key={i} className="text-xs">
                          {item.quantity}x {item.product.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`uppercase text-xs font-bold px-2 py-0.5 rounded-full ${
                      sale.paymentMethod === 'cash' ? 'bg-primary/10 text-primary' :
                      sale.paymentMethod === 'pos' ? 'bg-secondary/10 text-secondary-foreground' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-bold">₦{sale.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
