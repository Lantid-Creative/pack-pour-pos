import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ReceiptPreview, getReceiptPrintHTML, PRINTER_CONFIGS, type PrinterType } from '@/components/ReceiptPreview';

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
  const { storeId } = useAuth();

  const { data: store } = useQuery({
    queryKey: ['store-settings', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data, error } = await supabase.from('stores').select('*').eq('id', storeId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const storeName = store?.name || 'BULKDRINK STORE';
  const printerType: PrinterType = (store as any)?.printer_type || '80mm';
  const header = (store as any)?.receipt_header || '';
  const footer = (store as any)?.receipt_footer || 'Thank you for your patronage!';
  const address = (store as any)?.receipt_show_address ? (store?.address || '') : '';
  const phone = (store as any)?.receipt_show_phone ? (store?.phone || '') : '';
  const config = PRINTER_CONFIGS[printerType];

  const handlePrint = () => {
    const html = getReceiptPrintHTML({
      sale,
      storeName,
      address,
      phone,
      header,
      footer,
      printerType,
    });

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = `${config.bodyWidth + 40}px`;
    iframe.style.height = '800px';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 500);
      }, 250);
    };

    setTimeout(() => {
      try { iframe.contentWindow?.print(); } catch {}
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 500);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" /> Receipt
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white rounded-md border border-border overflow-hidden" style={{ maxWidth: `${config.previewWidth}px`, margin: '0 auto' }}>
          <ReceiptPreview
            sale={sale}
            storeName={storeName}
            address={address}
            phone={phone}
            header={header}
            footer={footer}
            printerType={printerType}
          />
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
