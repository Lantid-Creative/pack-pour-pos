import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';

type ReportRange = 'today' | 'week' | 'month' | 'custom';

function getDateRange(range: ReportRange): Date {
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
    case 'custom':
      return new Date(0);
  }
}

export default function SalesHistoryPage() {
  const { storeId } = useAuth();
  const [reportRange, setReportRange] = useState<ReportRange>('today');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const { data: allSales = [] } = useQuery({
    queryKey: ['sales-history', storeId],
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

  const filteredSales = useMemo(() => {
    if (reportRange === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return allSales.filter((s: any) => {
        const d = new Date(s.created_at);
        return d >= start && d <= end;
      });
    }
    const rangeStart = getDateRange(reportRange);
    return allSales.filter((s: any) => new Date(s.created_at) >= rangeStart);
  }, [allSales, reportRange, customStart, customEnd]);

  const summary = useMemo(() => {
    const totalRevenue = filteredSales.reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const cashRevenue = filteredSales.filter((s: any) => s.payment_method === 'cash').reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const posRevenue = filteredSales.filter((s: any) => s.payment_method === 'pos').reduce((s: number, sale: any) => s + Number(sale.total), 0);
    const transferRevenue = filteredSales.filter((s: any) => s.payment_method === 'transfer').reduce((s: number, sale: any) => s + Number(sale.total), 0);
    return { totalRevenue, cashRevenue, posRevenue, transferRevenue, count: filteredSales.length };
  }, [filteredSales]);

  const rangeLabel = reportRange === 'custom' && customStart && customEnd
    ? `${customStart} to ${customEnd}`
    : reportRange === 'today' ? 'Today'
    : reportRange === 'week' ? 'Last 7 Days'
    : 'Last 30 Days';

  const exportCSV = () => {
    if (filteredSales.length === 0) { toast.error('No sales to export'); return; }

    const rows: string[][] = [];

    // Report Header
    rows.push(['BULKDRINK SALES REPORT']);
    rows.push([`Period: ${rangeLabel}`]);
    rows.push([`Generated: ${new Date().toLocaleString('en-NG')}`]);
    rows.push([]);

    // Summary Section
    rows.push(['=== SUMMARY ===']);
    rows.push(['Total Transactions', summary.count.toString()]);
    rows.push(['Total Revenue', `₦${summary.totalRevenue.toLocaleString()}`]);
    rows.push(['Cash Revenue', `₦${summary.cashRevenue.toLocaleString()}`]);
    rows.push(['POS Revenue', `₦${summary.posRevenue.toLocaleString()}`]);
    rows.push(['Transfer Revenue', `₦${summary.transferRevenue.toLocaleString()}`]);
    rows.push([]);

    // Detailed Sales — one row per item
    rows.push(['=== DETAILED SALES ===']);
    rows.push(['Sale ID', 'Date', 'Time', 'Cashier', 'Payment', 'Product', 'Pack Size', 'Qty', 'Unit Price (₦)', 'Line Total (₦)', 'Sale Total (₦)']);

    filteredSales.forEach((sale: any) => {
      const date = new Date(sale.created_at);
      const dateStr = date.toLocaleDateString('en-NG');
      const timeStr = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
      const items = sale.sale_items || [];

      items.forEach((item: any, idx: number) => {
        const lineTotal = item.quantity * Number(item.unit_price);
        rows.push([
          idx === 0 ? `#${sale.id.slice(-6)}` : '',
          idx === 0 ? dateStr : '',
          idx === 0 ? timeStr : '',
          idx === 0 ? sale.cashier_name : '',
          idx === 0 ? sale.payment_method.toUpperCase() : '',
          item.product_name,
          item.pack_size || '',
          item.quantity.toString(),
          Number(item.unit_price).toLocaleString(),
          lineTotal.toLocaleString(),
          idx === 0 ? `₦${Number(sale.total).toLocaleString()}` : '',
        ]);
      });

      // If no items, still show the sale
      if (items.length === 0) {
        rows.push([
          `#${sale.id.slice(-6)}`, dateStr, timeStr, sale.cashier_name,
          sale.payment_method.toUpperCase(), '—', '—', '—', '—', '—',
          `₦${Number(sale.total).toLocaleString()}`,
        ]);
      }
    });

    rows.push([]);
    rows.push(['=== TOP SELLING PRODUCTS ===']);
    rows.push(['Product', 'Pack Size', 'Total Qty Sold', 'Total Revenue (₦)']);

    // Aggregate top products
    const productMap = new Map<string, { packSize: string; qty: number; revenue: number }>();
    filteredSales.forEach((sale: any) => {
      (sale.sale_items || []).forEach((item: any) => {
        const key = `${item.product_name}||${item.pack_size || ''}`;
        const existing = productMap.get(key) || { packSize: item.pack_size || '', qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += item.quantity * Number(item.unit_price);
        productMap.set(key, existing);
      });
    });

    Array.from(productMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .forEach(([key, val]) => {
        const name = key.split('||')[0];
        rows.push([name, val.packSize, val.qty.toString(), `₦${val.revenue.toLocaleString()}`]);
      });

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BulkDrink-Sales-Report-${rangeLabel.replace(/\s/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Excel report downloaded!');
  };

  const exportPDF = async () => {
    if (filteredSales.length === 0) { toast.error('No sales to export'); return; }

    const { default: jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // ─── HEADER ───────────────────────────────────────────────
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, pageWidth, 36, 'F');
    doc.setTextColor(255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BulkDrink', 14, 16);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Sales Report', 14, 24);
    doc.setFontSize(9);
    doc.text(`Period: ${rangeLabel}  |  Generated: ${new Date().toLocaleString('en-NG')}`, 14, 32);

    // ─── SUMMARY CARDS ────────────────────────────────────────
    const cardY = 44;
    const cardW = (pageWidth - 28 - 12) / 4; // 4 cards with gaps
    const cards = [
      { label: 'Total Sales', value: summary.count.toString() },
      { label: 'Revenue', value: `₦${summary.totalRevenue.toLocaleString()}` },
      { label: 'Cash', value: `₦${summary.cashRevenue.toLocaleString()}` },
      { label: 'POS / Transfer', value: `₦${(summary.posRevenue + summary.transferRevenue).toLocaleString()}` },
    ];

    cards.forEach((card, i) => {
      const x = 14 + i * (cardW + 4);
      doc.setFillColor(248, 247, 252);
      doc.roundedRect(x, cardY, cardW, 22, 2, 2, 'F');
      doc.setTextColor(100);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(card.label, x + 4, cardY + 8);
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(card.value, x + 4, cardY + 17);
    });

    // ─── DETAILED SALES TABLE (item-level) ─────────────────────
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', 14, 78);

    const tableData: string[][] = [];
    filteredSales.forEach((sale: any) => {
      const date = new Date(sale.created_at);
      const dateStr = date.toLocaleDateString('en-NG');
      const timeStr = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
      const items = sale.sale_items || [];

      items.forEach((item: any, idx: number) => {
        const lineTotal = item.quantity * Number(item.unit_price);
        tableData.push([
          idx === 0 ? `#${sale.id.slice(-6)}` : '',
          idx === 0 ? `${dateStr}\n${timeStr}` : '',
          idx === 0 ? sale.cashier_name : '',
          item.product_name,
          item.pack_size || '—',
          item.quantity.toString(),
          `₦${Number(item.unit_price).toLocaleString()}`,
          `₦${lineTotal.toLocaleString()}`,
          idx === 0 ? sale.payment_method.toUpperCase() : '',
        ]);
      });
    });

    (doc as any).autoTable({
      startY: 82,
      head: [['ID', 'Date', 'Cashier', 'Product', 'Pack Size', 'Qty', 'Unit Price', 'Line Total', 'Payment']],
      body: tableData,
      styles: { fontSize: 7, cellPadding: 2.5, lineColor: [230, 230, 230], lineWidth: 0.1 },
      headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
      alternateRowStyles: { fillColor: [250, 249, 255] },
      columnStyles: {
        0: { cellWidth: 14, fontStyle: 'bold' },
        1: { cellWidth: 22 },
        2: { cellWidth: 22 },
        3: { cellWidth: 32 },
        4: { cellWidth: 26 },
        5: { cellWidth: 10, halign: 'center' },
        6: { cellWidth: 20, halign: 'right' },
        7: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
        8: { cellWidth: 18, halign: 'center' },
      },
    });

    // ─── TOP PRODUCTS TABLE ───────────────────────────────────
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Aggregate products
    const productMap = new Map<string, { packSize: string; qty: number; revenue: number }>();
    filteredSales.forEach((sale: any) => {
      (sale.sale_items || []).forEach((item: any) => {
        const key = `${item.product_name}||${item.pack_size || ''}`;
        const existing = productMap.get(key) || { packSize: item.pack_size || '', qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += item.quantity * Number(item.unit_price);
        productMap.set(key, existing);
      });
    });

    const topProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 15);

    if (topProducts.length > 0) {
      // Check if we need a new page
      if (finalY > doc.internal.pageSize.height - 60) {
        doc.addPage();
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Top Selling Products', 14, 20);

        (doc as any).autoTable({
          startY: 24,
          head: [['#', 'Product', 'Pack Size', 'Qty Sold', 'Revenue']],
          body: topProducts.map(([key, val], i) => [
            (i + 1).toString(),
            key.split('||')[0],
            val.packSize,
            val.qty.toString(),
            `₦${val.revenue.toLocaleString()}`,
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            4: { halign: 'right', fontStyle: 'bold' },
          },
        });
      } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Top Selling Products', 14, finalY);

        (doc as any).autoTable({
          startY: finalY + 4,
          head: [['#', 'Product', 'Pack Size', 'Qty Sold', 'Revenue']],
          body: topProducts.map(([key, val], i) => [
            (i + 1).toString(),
            key.split('||')[0],
            val.packSize,
            val.qty.toString(),
            `₦${val.revenue.toLocaleString()}`,
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            4: { halign: 'right', fontStyle: 'bold' },
          },
        });
      }
    }

    // ─── FOOTER ───────────────────────────────────────────────
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(`BulkDrink POS — Sales Report — Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 8);
      doc.text(`Generated ${new Date().toLocaleString('en-NG')}`, pageWidth - 14, doc.internal.pageSize.height - 8, { align: 'right' });
    }

    doc.save(`BulkDrink-Sales-Report-${rangeLabel.replace(/\s/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('PDF report downloaded!');
  };

  const rangeOptions: { value: ReportRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales History</h1>
          <p className="text-sm text-muted-foreground">View and export sales reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <FileText className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setReportRange(opt.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                reportRange === opt.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {reportRange === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-input bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-input bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <SummaryCard label="Total Sales" value={summary.count.toString()} />
        <SummaryCard label="Revenue" value={`₦${summary.totalRevenue.toLocaleString()}`} highlight />
        <SummaryCard label="Cash" value={`₦${summary.cashRevenue.toLocaleString()}`} />
        <SummaryCard label="POS" value={`₦${summary.posRevenue.toLocaleString()}`} />
        <SummaryCard label="Transfer" value={`₦${summary.transferRevenue.toLocaleString()}`} />
      </div>

      {/* Sales Table */}
      {filteredSales.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No sales for this period</p>
          <p className="text-sm">Try selecting a different date range</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {filteredSales.length} transaction{filteredSales.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-muted-foreground">{rangeLabel}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Sale ID</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cashier</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Items</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Payment</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale: any) => (
                  <tr key={sale.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4 font-mono-numbers text-xs font-medium">{sale.id.slice(-6)}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div>{new Date(sale.created_at).toLocaleDateString('en-NG')}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(sale.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{sale.cashier_name}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {(sale.sale_items || []).map((item: any, i: number) => (
                          <div key={i} className="text-xs">{item.quantity}x {item.product_name}</div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`uppercase text-xs font-bold px-2 py-0.5 rounded-full ${
                        sale.payment_method === 'cash' ? 'bg-primary/10 text-primary' :
                        sale.payment_method === 'pos' ? 'bg-secondary/10 text-secondary-foreground' :
                        'bg-accent/20 text-accent-foreground'
                      }`}>{sale.payment_method}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers font-bold">₦{Number(sale.total).toLocaleString()}</td>
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

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border text-center ${highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold font-mono-numbers ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
    </div>
  );
}
