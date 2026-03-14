import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';

interface SaleItem {
  product: { id: string; name: string; pack_size: string; price: number };
  quantity: number;
}

interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  cashier: string;
  date: string;
}

interface Props {
  sale: Sale;
  open: boolean;
  onClose: () => void;
}

export function ReceiptDialog({ sale, open, onClose }: Props) {
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    const win = window.open('', '', 'width=300,height=600');
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; width: 280px; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; }
      </style></head><body>
      ${printContent.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" /> Receipt
          </DialogTitle>
        </DialogHeader>
        <div id="receipt-content" className="receipt-font bg-card p-4 rounded-md border border-border">
          <div className="text-center mb-3">
            <div className="font-bold text-base">BULKDRINK STORE</div>
            <div className="text-xs text-muted-foreground">Wholesale Drinks & Beverages</div>
            <div className="text-xs text-muted-foreground">Lagos, Nigeria</div>
          </div>
          <div className="border-t border-dashed border-border my-2" />
          <div className="flex justify-between text-xs mb-1">
            <span>Date: {sale.date}</span>
            <span>#{sale.id.slice(-6)}</span>
          </div>
          <div className="text-xs mb-2">Cashier: {sale.cashier}</div>
          <div className="border-t border-dashed border-border my-2" />
          <div className="space-y-1.5">
            {sale.items.map((item, i) => (
              <div key={i}>
                <div className="text-xs font-medium">{item.product.name}</div>
                <div className="flex justify-between text-xs">
                  <span>{item.quantity} x ₦{item.product.price.toLocaleString()}</span>
                  <span className="font-bold">₦{(item.quantity * item.product.price).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-border my-2" />
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>₦{sale.total.toLocaleString()}</span>
          </div>
          <div className="text-xs text-center mt-2 uppercase">Paid via: {sale.paymentMethod}</div>
          <div className="border-t border-dashed border-border my-2" />
          <div className="text-center text-xs text-muted-foreground">Thank you for your patronage!</div>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors">Close</button>
          <button onClick={handlePrint} className="flex-1 py-2 rounded-md bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-colors">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
