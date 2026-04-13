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
    fontSizeSmall: 12,
    fontSizeLarge: 16,
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

function getReceiptTheme(printerType: PrinterType) {
  const isA4 = printerType === 'A4';
  const isThermal = !isA4;

  return {
    isA4,
    isThermal,
    fontFamily: isA4 ? "'Segoe UI', Arial, sans-serif" : "Arial, Helvetica, sans-serif",
    fontWeight: isThermal ? 700 : 400,
    text: '#000000',
    muted: isA4 ? '#666666' : '#000000',
    border: '#000000',
    softBorder: isA4 ? '#e5e7eb' : '#000000',
    separator: isA4 ? '1px solid #ccc' : '1px solid #000',
    separatorBold: isA4 ? '2px solid #000' : '2px solid #000',
    lineHeight: '1.4',
    letterSpacing: isA4 ? 'normal' : '0.2px',
  };
}

export function ReceiptPreview({ sale, storeName, address, phone, header, footer, printerType }: ReceiptProps) {
  const config = PRINTER_CONFIGS[printerType];
  const theme = getReceiptTheme(printerType);

  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: `${config.fontSize}px`,
        fontWeight: theme.fontWeight,
        lineHeight: theme.lineHeight,
        letterSpacing: theme.letterSpacing,
        padding: `${config.padding}px`,
        color: theme.text,
        background: '#fff',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: theme.isA4 ? '16px' : '8px' }}>
        <div style={{ fontWeight: 'bold', fontSize: `${config.fontSizeLarge}px`, textTransform: 'uppercase' }}>
          {storeName || 'Your Store'}
        </div>
        {header && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: theme.muted, marginTop: '2px' }}>{header}</div>
        )}
        {address && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: theme.muted, marginTop: '2px' }}>{address}</div>
        )}
        {phone && (
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: theme.muted, marginTop: '1px' }}>Tel: {phone}</div>
        )}
      </div>

      <div style={{ borderTop: theme.separator, margin: `${theme.isA4 ? 12 : 6}px 0` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${config.fontSizeSmall}px`, marginBottom: '4px' }}>
        <span>Date: {sale.date}</span>
        <span>#{sale.id.slice(-6)}</span>
      </div>
      <div style={{ fontSize: `${config.fontSizeSmall}px`, marginBottom: '6px' }}>Cashier: {sale.cashier}</div>

      <div style={{ borderTop: theme.separator, margin: `${theme.isA4 ? 12 : 6}px 0` }} />

      {theme.isA4 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${config.fontSize}px`, marginBottom: '8px' }}>
          <thead>
            <tr style={{ borderBottom: theme.separator }}>
              <th style={{ textAlign: 'left', padding: '4px 0', fontWeight: 700 }}>Item</th>
              <th style={{ textAlign: 'center', padding: '4px 8px', fontWeight: 700 }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 700 }}>Price</th>
              <th style={{ textAlign: 'right', padding: '4px 0', fontWeight: 700 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${theme.softBorder}` }}>
                <td style={{ padding: '4px 0' }}>
                  {item.product.name}
                  <div style={{ fontSize: `${config.fontSizeSmall}px`, color: theme.muted }}>{item.product.pack_size}</div>
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
              <div style={{ fontSize: `${config.fontSizeSmall}px`, fontWeight: 700 }}>{item.product.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${config.fontSizeSmall}px` }}>
                <span>{item.quantity} x ₦{item.product.price.toLocaleString()}</span>
                <span style={{ fontWeight: 'bold' }}>₦{(item.quantity * item.product.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: theme.separatorBold, margin: `${theme.isA4 ? 12 : 6}px 0` }} />

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
                <div style={{ fontSize: `${config.fontSizeSmall - 1}px`, color: theme.muted }}>
                  {cd.cratesBrought}/{cd.cratesRequired} crates returned • {owed} owed
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: theme.separator, margin: `${theme.isA4 ? 8 : 4}px 0` }} />
          <div style={{ fontSize: `${config.fontSizeSmall}px`, color: theme.muted, textAlign: 'center', marginBottom: '4px', fontWeight: 700 }}>
            Keep this receipt to claim crate deposit refund
          </div>
          <div style={{ borderTop: theme.separator, margin: `${theme.isA4 ? 8 : 4}px 0` }} />
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: `${config.fontSizeLarge}px` }}>
        <span>TOTAL</span>
        <span>₦{sale.total.toLocaleString()}</span>
      </div>

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
        <div style={{ textAlign: 'center', fontSize: `${config.fontSizeSmall}px`, textTransform: 'uppercase', marginTop: '8px', fontWeight: 700 }}>
          Paid via: {sale.paymentMethod}
        </div>
      )}

      <div style={{ borderTop: theme.separator, margin: `${theme.isA4 ? 12 : 6}px 0` }} />

      {footer && (
        <div style={{ textAlign: 'center', fontSize: `${config.fontSizeSmall}px`, color: theme.muted, fontWeight: theme.isA4 ? 400 : 700 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export function getReceiptPrintHTML(props: ReceiptProps): string {
  const config = PRINTER_CONFIGS[props.printerType];
  const theme = getReceiptTheme(props.printerType);
  const thermalWidth = props.printerType === 'A4' ? '100%' : props.printerType;

  const itemsHTML = theme.isA4
    ? `<table style="width:100%;border-collapse:collapse;font-size:${config.fontSize}px;margin-bottom:8px">
        <thead><tr style="border-bottom:${theme.separator}">
          <th style="text-align:left;padding:4px 0;font-weight:700">Item</th>
          <th style="text-align:center;padding:4px 8px;font-weight:700">Qty</th>
          <th style="text-align:right;padding:4px 0;font-weight:700">Price</th>
          <th style="text-align:right;padding:4px 0;font-weight:700">Total</th>
        </tr></thead>
        <tbody>${props.sale.items.map(item => `
          <tr style="border-bottom:1px solid ${theme.softBorder}">
            <td style="padding:4px 0">${item.product.name}<br><span style="font-size:${config.fontSizeSmall}px;color:${theme.muted}">${item.product.pack_size}</span></td>
            <td style="text-align:center;padding:4px 8px">${item.quantity}</td>
            <td style="text-align:right;padding:4px 0">₦${item.product.price.toLocaleString()}</td>
            <td style="text-align:right;padding:4px 0;font-weight:bold">₦${(item.quantity * item.product.price).toLocaleString()}</td>
          </tr>`).join('')}
        </tbody></table>`
    : props.sale.items.map(item => `
        <div style="margin-bottom:6px">
          <div style="font-size:${config.fontSizeSmall}px;font-weight:700">${item.product.name}</div>
          <div style="display:flex;justify-content:space-between;font-size:${config.fontSizeSmall}px">
            <span>${item.quantity} x ₦${item.product.price.toLocaleString()}</span>
            <span style="font-weight:bold">₦${(item.quantity * item.product.price).toLocaleString()}</span>
          </div>
        </div>`).join('');

  const sep = `<div style="border-top:${theme.separator};margin:${theme.isA4 ? 12 : 6}px 0"></div>`;
  const sepBold = `<div style="border-top:${theme.separatorBold};margin:${theme.isA4 ? 12 : 6}px 0"></div>`;

  return `<html><head><title>Receipt</title>
    <style>
      ${theme.isA4 ? '@page { size: A4; margin: 15mm; }' : '@page { margin: 0; }'}
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        width: ${thermalWidth};
      }
      * { box-sizing: border-box; }
      body {
        font-family: ${theme.fontFamily};
        font-size: ${config.fontSize}px;
        font-weight: ${theme.fontWeight};
        line-height: ${theme.lineHeight};
        letter-spacing: ${theme.letterSpacing};
        padding: ${theme.isA4 ? '0' : '2mm'};
        width: ${thermalWidth};
        color: ${theme.text};
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        text-rendering: geometricPrecision;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          width: ${thermalWidth};
        }
        body {
          margin: 0;
        }
      }
    </style></head><body>
    <div style="text-align:center;margin-bottom:${theme.isA4 ? 16 : 8}px">
      <div style="font-weight:bold;font-size:${config.fontSizeLarge}px;text-transform:uppercase">${props.storeName || 'Your Store'}</div>
      ${props.header ? `<div style="font-size:${config.fontSizeSmall}px;color:${theme.muted};margin-top:2px">${props.header}</div>` : ''}
      ${props.address ? `<div style="font-size:${config.fontSizeSmall}px;color:${theme.muted};margin-top:2px">${props.address}</div>` : ''}
      ${props.phone ? `<div style="font-size:${config.fontSizeSmall}px;color:${theme.muted};margin-top:1px">Tel: ${props.phone}</div>` : ''}
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
        <div style="font-size:${config.fontSizeSmall - 1}px;color:${theme.muted}">${cd.cratesBrought}/${cd.cratesRequired} crates returned • ${owed} owed</div>
      </div>`;
    }).join('') + `${sep}<div style="font-size:${config.fontSizeSmall}px;color:${theme.muted};text-align:center;margin-bottom:4px;font-weight:700">Keep this receipt to claim crate deposit refund</div>${sep}` : ''}
    <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:${config.fontSizeLarge}px">
      <span>TOTAL</span><span>₦${props.sale.total.toLocaleString()}</span>
    </div>
    ${props.sale.paymentSplits && props.sale.paymentSplits.length > 0
      ? `<div style="margin-top:8px"><div style="text-align:center;font-size:${config.fontSizeSmall}px;text-transform:uppercase;font-weight:bold;margin-bottom:4px">Split Payment</div>${props.sale.paymentSplits.map(sp => `<div style="display:flex;justify-content:space-between;font-size:${config.fontSizeSmall}px"><span style="text-transform:uppercase">${sp.method}</span><span>₦${sp.amount.toLocaleString()}</span></div>`).join('')}</div>`
      : `<div style="text-align:center;font-size:${config.fontSizeSmall}px;text-transform:uppercase;margin-top:8px;font-weight:700">Paid via: ${props.sale.paymentMethod}</div>`}
    ${sep}
    ${props.footer ? `<div style="text-align:center;font-size:${config.fontSizeSmall}px;color:${theme.muted};font-weight:${theme.isA4 ? 400 : 700}">${props.footer}</div>` : ''}
    </body></html>`;
}
