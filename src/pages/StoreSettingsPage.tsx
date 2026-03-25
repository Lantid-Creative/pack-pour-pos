import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Settings, Printer, Store, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ReceiptPreview, PRINTER_CONFIGS, type PrinterType } from '@/components/ReceiptPreview';
import { SurchargeSettings } from '@/components/SurchargeSettings';

export default function StoreSettingsPage() {
  const { storeId, role } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  // Store details
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Receipt settings
  const [printerType, setPrinterType] = useState<PrinterType>('80mm');
  const [receiptHeader, setReceiptHeader] = useState('');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for your patronage!');
  const [showAddress, setShowAddress] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const { data: store } = useQuery({
    queryKey: ['store-settings', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  useEffect(() => {
    if (store) {
      setStoreName(store.name || '');
      setAddress(store.address || '');
      setPhone(store.phone || '');
      setPrinterType((store as any).printer_type || '80mm');
      setReceiptHeader((store as any).receipt_header || '');
      setReceiptFooter((store as any).receipt_footer || 'Thank you for your patronage!');
      setShowAddress((store as any).receipt_show_address ?? true);
      setShowPhone((store as any).receipt_show_phone ?? true);
    }
  }, [store]);

  const handleSave = async () => {
    if (!storeId) return;
    setSaving(true);
    const { error } = await supabase
      .from('stores')
      .update({
        name: storeName.trim(),
        address: address.trim() || null,
        phone: phone.trim() || null,
        printer_type: printerType,
        receipt_header: receiptHeader.trim(),
        receipt_footer: receiptFooter.trim(),
        receipt_show_address: showAddress,
        receipt_show_phone: showPhone,
      } as any)
      .eq('id', storeId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Settings saved!');
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    }
    setSaving(false);
  };

  const sampleSale = {
    id: 'sample-receipt-001',
    items: [
      { product: { id: '1', name: 'Coca-Cola 50cl', pack_size: 'Crate (24)', price: 4200 }, quantity: 2 },
      { product: { id: '2', name: 'Amstel Malta', pack_size: 'Pack (6)', price: 1800 }, quantity: 1 },
      { product: { id: '3', name: 'Star Lager', pack_size: 'Crate (12)', price: 5400 }, quantity: 3 },
    ],
    total: 26400,
    paymentMethod: 'cash',
    cashier: 'John Doe',
    date: new Date().toLocaleString('en-NG'),
  };

  if (role !== 'owner') {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Only the store owner can access settings.</p>
      </div>
    );
  }

  const config = PRINTER_CONFIGS[printerType];

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6" /> Store Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your store details and printer configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Settings Form */}
        <div className="space-y-6">
          {/* Store Details */}
          <div id="tour-store-details" className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" /> Store Details
            </h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Store Name</label>
              <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Printer Settings */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Printer className="h-5 w-5 text-primary" /> Printer & Receipt Settings
            </h2>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Printer Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PRINTER_CONFIGS) as PrinterType[]).map((type) => {
                  const cfg = PRINTER_CONFIGS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setPrinterType(type)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        printerType === type
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <p className="font-semibold text-sm text-foreground">{cfg.label}</p>
                      <p className="text-xs text-muted-foreground">{cfg.paperWidth}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cfg.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Receipt Header (extra line below store name)</label>
              <input type="text" value={receiptHeader} onChange={(e) => setReceiptHeader(e.target.value)}
                placeholder="e.g. Wholesale Drinks & Beverages"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Receipt Footer Message</label>
              <input type="text" value={receiptFooter} onChange={(e) => setReceiptFooter(e.target.value)}
                placeholder="Thank you for your patronage!"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showAddress} onChange={(e) => setShowAddress(e.target.checked)}
                  className="rounded border-input" />
                <span className="text-foreground">Show address on receipt</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded border-input" />
                <span className="text-foreground">Show phone on receipt</span>
              </label>
            </div>
          </div>

          {/* Surcharge Settings */}
          <SurchargeSettings />

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted transition-all lg:hidden">
              <Eye className="h-4 w-4" /> {showPreview ? 'Hide Preview' : 'Preview Receipt'}
            </button>
          </div>
        </div>

        {/* Right Column: Receipt Preview */}
        <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-6">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> Receipt Preview
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              This is how your receipt will look on <strong>{config.label}</strong> paper ({config.paperWidth})
            </p>
            <div className="bg-muted/30 rounded-xl p-6 flex justify-center">
              <div className="bg-white rounded shadow-lg overflow-hidden" style={{ width: `${config.previewWidth}px` }}>
                <ReceiptPreview
                  sale={sampleSale}
                  storeName={storeName}
                  address={showAddress ? address : ''}
                  phone={showPhone ? phone : ''}
                  header={receiptHeader}
                  footer={receiptFooter}
                  printerType={printerType}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
