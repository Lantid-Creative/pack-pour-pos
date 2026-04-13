export type PrinterType = '58mm' | '80mm' | 'A4';

export const PRINTER_CONFIGS: Record<PrinterType, {
  label: string;
  paperWidth: string;
  description: string;
  bodyWidth: number;
  previewWidth: number;
  fontSize: number;
  fontSizeSmall: number;
  fontSizeLarge: number;
  padding: number;
}> = {
  '58mm': {
    label: '58mm Thermal',
    paperWidth: '58mm (~32 chars)',
    description: 'Small POS printers',
    bodyWidth: 220,
    previewWidth: 240,
    fontSize: 13,
    fontSizeSmall: 11,
    fontSizeLarge: 15,
    padding: 6,
  },
  '80mm': {
    label: '80mm Thermal',
    paperWidth: '80mm (~48 chars)',
    description: 'Standard POS printers',
    bodyWidth: 300,
    previewWidth: 300,
    fontSize: 12,
    fontSizeSmall: 10,
    fontSizeLarge: 14,
    padding: 10,
  },
  'A4': {
    label: 'A4 Paper',
    paperWidth: '210mm (full page)',
    description: 'Regular office printers',
    bodyWidth: 500,
    previewWidth: 380,
    fontSize: 13,
    fontSizeSmall: 11,
    fontSizeLarge: 16,
    padding: 24,
  },
};

interface CrateInfo {
  productId: string;
  productName: string;
  cratesRequired: number;
  cratesBrought: number;
  depositPerCrate: number;
}

interface SaleItem {
  product: { id: string; name: string; pack_size: string; price: number };
  quantity: number;
}

interface PaymentSplit {
  method: string;
  amount: number;
}

interface ReceiptProps {
  sale: {
    id: string;
    items: SaleItem[];
    total: number;
    paymentMethod: string;
    cashier: string;
    date: string;
    crateDeposits?: CrateInfo[];
    paymentSplits?: PaymentSplit[];
  };
  storeName: string;
  address?: string;
  phone?: string;
  header?: string;
  footer?: string;
  printerType: PrinterType;
}

export function ReceiptPreview({ sale, storeName, address, phone, header, footer, printerType }: ReceiptProps) {
  const config = PRINTER_CONFIGS[printerType];
  const isA4 = printerType === 'A4';

  return (
    <div
      style={{
        fontFamily: isA4 ? "'Segoe UI', Arial, sans-serif" : "'Courier New', monospace",
        fontSize: `${config.fontSize}px`,
        lineHeight: '1.4',
        padding: `${config.padding}px`,
        color: '#000',
        background: '#fff',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: isA4 ? '16px' : '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: `${config.fontSizeLarge}px`, textTransform: 'uppercase' }}>
          {storeName || 'Your Store'}
        </div>
        {header && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: '#666', marginTop: '2px' }}>{header}</div>
        )}
        {address && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: '#666', marginTop: '2px' }}>{address}</div>
        )}
        {phone && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: '#666', marginTop: '1px' }}>Tel: {phone}</div>
        )}
      </div>

      {/* Separator */}
      <div style={{ borderTop: isA4 ? '1px solid #ccc' : '1px dashed #000', margin: `${isA4 ? 12 : 6}px 0` }} />

      {/* Sale info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${config.fontSizeSmall}px`, marginBottom: '4px' }}>
        <span>Date: {sale.date}</span>
        <span>#{sale.id.slice(-6)}</span>
      </div>
      <div style={{ fontSize: `${config.fontSizeSmall}px`, marginBottom: '6px' }}>Cashier: {sale.cashier}</div>

      {/* Separator */}
      <div style={{ borderTop: isA4 ? '1px solid #ccc' : '1px dashed #000', margin: `${isA4 ? 12 : 6}px 0` }} />

      {/* Items */}
      {isA4 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${config.fontSize}px`, marginBottom: '8px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '4px 0', fontWeight: 600 }}>Item</th>
              <th style={{ textAlign: 'center', padding: '4px 8px', fontWeight: 600 }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600 }}>Price</th>
              <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 600 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '4px 0' }}>
                  {item.product.name}
                  <div style={{ fontSize: `${config.fontSizeSmall}px`, color: '#888' }}>{item.product.pack_size}</div>
                </td>
                <td style={{ textAlign: 'center', padding: '4px 8px' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right', padding: '4px 0' }}>₦{item.product.price.toLocaleString()}</td>
                <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>₦{(item.quantity * item.product.price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ marginBottom: '6px' }}>
          {sale.items.map((item, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: `${config.fontSizeSmall}px`, fontWeight: 500 }}>{item.product.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${config.fontSizeSmall}px` }}>
                <span>{item.quantity} x ₦{item.product.price.toLocaleString()}</span>
                <span style={{ fontWeight: 'bold' }}>₦{(item.quantity * item.product.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Separator */}
      <div style={{ borderTop: isA4 ? '2px solid #000' : '1px dashed #000', margin: `${isA4 ? 12 : 6}px 0` }} />

      {/* Crate Deposits */}
      {sale.crateDeposits && sale.crateDeposits.length > 0 && (
        <>
          {sale.crateDeposits.map((cd, i) => {
            const owed = Math.max(0, cd.cratesRequired - cd.cratesBrought);
            if (owed <= 0) return null;
            return (
              <div key={i} style={{ fontSize: `${config.fontSizeSmall}px`, marginBottom: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Crate deposit: {cd.productName}</span>
                  <span style={{ fontWeight: 'bold' }}>₦{(owed * cd.depositPerCrate).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: `${config.fontSizeSmall - 1}px`, color: '#666' }}>
                  {cd.cratesBrought}/{cd.cratesRequired} crates returned • {owed} owed
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: isA4 ? '1px solid #ccc' : '1px dashed #000', margin: `${isA4 ? 8 : 4}px 0` }} />
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: '#666', textAlign: 'center', marginBottom: '4px' }}>
            ⚠ Keep this receipt to claim crate deposit refund
          </div>
          <div style={{ borderTop: isA4 ? '1px solid #ccc' : '1px dashed #000', margin: `${isA4 ? 8 : 4}px 0` }} />
        </>
      )}

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${config.fontSizeLarge}px` }}>
        <span>TOTAL</span>
        <span>₦{sale.total.toLocaleString()}</span>
      </div>

      {/* Payment */}
      {sale.paymentSplits && sale.paymentSplits.length > 0 ? (
        <div style={{ marginTop: '8px' }}>
          <div style={{ textAlign: 'center', fontSize: `${config.fontSizeSmall}px`, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>
            Split Payment
          </div>
          {sale.paymentSplits.map((sp, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${config.fontSizeSmall}px` }}>
              <span style={{ textTransform: 'uppercase' }}>{sp.method}</span>
              <span>₦{sp.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontSize: `${config.fontSizeSmall}px`, textTransform: 'uppercase', marginTop: '8px' }}>
          Paid via: {sale.paymentMethod}
        </div>
      )}

      {/* Separator */}
      <div style={{ borderTop: isA4 ? '1px solid #ccc' : '1px dashed #000', margin: `${isA4 ? 12 : 6}px 0` }} />

      {/* Footer */}
      {footer && (
        <div style={{ textAlign: 'center', fontSize: `${config.fontSizeSmall}px`, color: '#666' }}>{footer}</div>
      )}
    </div>
  );
}

/**
 * Generates print-ready HTML for a receipt
 */
export function getReceiptPrintHTML(props: ReceiptProps): string {
  const config = PRINTER_CONFIGS[props.printerType];
  const isA4 = props.printerType === 'A4';

  const itemsHTML = isA4
    ? `<table style="width:100%;border-collapse:collapse;font-size:${config.fontSize}px;margin-bottom:8px">
        <thead><tr style="border-bottom:1px solid #ccc">
          <th style="text-align:left;padding:4px 0;font-weight:600">Item</th>
          <th style="text-align:center;padding:4px 8px;font-weight:600">Qty</th>
          <th style="text-align:right;padding:4px 0;font-weight:600">Price</th>
          <th style="text-align:right;padding:4px 0;font-weight:600">Total</th>
        </tr></thead>
        <tbody>${props.sale.items.map(item => `
          <tr style="border-bottom:1px solid #eee">
            <td style="padding:4px 0">${item.product.name}<br><span style="font-size:${config.fontSizeSmall}px;color:#888">${item.product.pack_size}</span></td>
            <td style="text-align:center;padding:4px 8px">${item.quantity}</td>
            <td style="text-align:right;padding:4px 0">₦${item.product.price.toLocaleString()}</td>
            <td style="text-align:right;padding:4px 0;font-weight:bold">₦${(item.quantity * item.product.price).toLocaleString()}</td>
          </tr>`).join('')}
        </tbody></table>`
    : props.sale.items.map(item => `
        <div style="margin-bottom:6px">
          <div style="font-size:${config.fontSizeSmall}px;font-weight:500">${item.product.name}</div>
          <div style="display:flex;justify-content:space-between;font-size:${config.fontSizeSmall}px">
            <span>${item.quantity} x ₦${item.product.price.toLocaleString()}</span>
            <span style="font-weight:bold">₦${(item.quantity * item.product.price).toLocaleString()}</span>
          </div>
        </div>`).join('');

  const sep = isA4
    ? '<div style="border-top:1px solid #ccc;margin:12px 0"></div>'
    : '<div style="border-top:1px dashed #000;margin:6px 0"></div>';

  const sepBold = isA4
    ? '<div style="border-top:2px solid #000;margin:12px 0"></div>'
    : '<div style="border-top:1px dashed #000;margin:6px 0"></div>';

  return `<html><head><title>Receipt</title>
    <style>
      @page { margin: ${isA4 ? '15mm' : '0'}; size: ${isA4 ? 'A4' : `${config.bodyWidth / 3.78}mm auto`}; }
      body { font-family: ${isA4 ? "'Segoe UI',Arial,sans-serif" : "'Courier New',monospace"}; font-size:${config.fontSize}px; padding:${config.padding}px; width:${config.bodyWidth}px; margin:0 auto; color:#000; -webkit-print-color-adjust: exact; line-height: 1.4; }
      @media print { body { padding:${isA4 ? '0' : `${config.padding}px`}; } }
    </style></head><body>
    <div style="text-align:center;margin-bottom:${isA4 ? 16 : 8}px">
      <div style="font-weight:bold;font-size:${config.fontSizeLarge}px;text-transform:uppercase">${props.storeName || 'Your Store'}</div>
      ${props.header ? `<div style="font-size:${config.fontSizeSmall}px;color:#666;margin-top:2px">${props.header}</div>` : ''}
      ${props.address ? `<div style="font-size:${config.fontSizeSmall}px;color:#666;margin-top:2px">${props.address}</div>` : ''}
      ${props.phone ? `<div style="font-size:${config.fontSizeSmall}px;color:#666;margin-top:1px">Tel: ${props.phone}</div>` : ''}
    </div>
    ${sep}
    <div style="display:flex;justify-content:space-between;font-size:${config.fontSizeSmall}px;margin-bottom:4px">
      <span>Date: ${props.sale.date}</span><span>#${props.sale.id.slice(-6)}</span>
    </div>
    <div style="font-size:${config.fontSizeSmall}px;margin-bottom:6px">Cashier: ${props.sale.cashier}</div>
    ${sep}
    ${itemsHTML}
    ${sepBold}
    ${props.sale.crateDeposits && props.sale.crateDeposits.length > 0 ? props.sale.crateDeposits.map(cd => {
      const owed = Math.max(0, cd.cratesRequired - cd.cratesBrought);
      if (owed <= 0) return '';
      return `<div style="font-size:${config.fontSizeSmall}px;margin-bottom:4px">
        <div style="display:flex;justify-content:space-between">
          <span>Crate deposit: ${cd.productName}</span>
          <span style="font-weight:bold">₦${(owed * cd.depositPerCrate).toLocaleString()}</span>
        </div>
        <div style="font-size:${config.fontSizeSmall - 1}px;color:#666">${cd.cratesBrought}/${cd.cratesRequired} crates returned • ${owed} owed</div>
      </div>`;
    }).join('') + `${sep}<div style="font-size:${config.fontSizeSmall}px;color:#666;text-align:center;margin-bottom:4px">⚠ Keep this receipt to claim crate deposit refund</div>${sep}` : ''}
    <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:${config.fontSizeLarge}px">
      <span>TOTAL</span><span>₦${props.sale.total.toLocaleString()}</span>
    </div>
    ${props.sale.paymentSplits && props.sale.paymentSplits.length > 0
      ? `<div style="margin-top:8px"><div style="text-align:center;font-size:${config.fontSizeSmall}px;text-transform:uppercase;font-weight:bold;margin-bottom:4px">Split Payment</div>${props.sale.paymentSplits.map(sp => `<div style="display:flex;justify-content:space-between;font-size:${config.fontSizeSmall}px"><span style="text-transform:uppercase">${sp.method}</span><span>₦${sp.amount.toLocaleString()}</span></div>`).join('')}</div>`
      : `<div style="text-align:center;font-size:${config.fontSizeSmall}px;text-transform:uppercase;margin-top:8px">Paid via: ${props.sale.paymentMethod}</div>`}
    ${sep}
    ${props.footer ? `<div style="text-align:center;font-size:${config.fontSizeSmall}px;color:#666">${props.footer}</div>` : ''}
    </body></html>`;
}
