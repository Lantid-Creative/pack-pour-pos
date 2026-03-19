import { useState } from 'react';
import { ChevronDown, ChevronRight, Package, ShoppingCart, PackageOpen, Users, CreditCard, BarChart3, Settings, Printer, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface GuideStep {
  step: number;
  title: string;
  description: string;
}

interface Guide {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  steps: GuideStep[];
}

const guides: Guide[] = [
  {
    id: 'create-product',
    title: 'Create a Normal Product',
    icon: Package,
    description: 'Add a new product to your inventory that is not a crate product.',
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click on "Inventory" in the sidebar navigation to open the inventory management page.' },
      { step: 2, title: 'Click "Add Product"', description: 'Click the "Add Product" button at the top of the inventory page.' },
      { step: 3, title: 'Fill in Product Details', description: 'Enter the product name, category, pack size (e.g. "Pack of 12"), selling price, and cost price.' },
      { step: 4, title: 'Set Stock & Threshold', description: 'Enter the initial stock quantity and set a low-stock threshold so you get alerted when stock is running low.' },
      { step: 5, title: 'Leave Crate Toggle Off', description: 'Make sure the "Crate Product" toggle is turned OFF for a normal product.' },
      { step: 6, title: 'Save', description: 'Click "Add Product" to save. Your product will now appear in the inventory list and be available in POS.' },
    ],
  },
  {
    id: 'create-crate-product',
    title: 'Create a Crate Product',
    icon: PackageOpen,
    description: 'Add a product that uses returnable crates with a deposit system.',
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click on "Inventory" in the sidebar navigation.' },
      { step: 2, title: 'Click "Add Product"', description: 'Click the "Add Product" button at the top of the page.' },
      { step: 3, title: 'Fill in Product Details', description: 'Enter the product name, category, pack size, selling price, and cost price as usual.' },
      { step: 4, title: 'Enable Crate Product', description: 'Turn ON the "Crate Product" toggle. A new field will appear for the deposit amount.' },
      { step: 5, title: 'Set Deposit Amount', description: 'Enter the deposit amount customers pay per crate if they don\'t bring empty crates.' },
      { step: 6, title: 'Save the Product', description: 'Click "Add Product" to save.' },
      { step: 7, title: 'Set Up Crate Inventory', description: 'Go to the "Crates" page from the sidebar. Click "Add Product", select your new crate product, and enter the total crates, filled crates, and empty crates you have.' },
    ],
  },
  {
    id: 'make-sale',
    title: 'Make a Sale (POS)',
    icon: ShoppingCart,
    description: 'Process a sale using the Point of Sale terminal.',
    steps: [
      { step: 1, title: 'Open POS', description: 'Click "POS Terminal" in the sidebar to open the point of sale screen.' },
      { step: 2, title: 'Search or Browse Products', description: 'Use the search bar to find products, or browse by category. Click on a product to add it to the cart.' },
      { step: 3, title: 'Adjust Quantities', description: 'Use the + and − buttons in the cart to adjust how many units the customer wants.' },
      { step: 4, title: 'Choose Payment Method', description: 'Select Cash, POS, Transfer, or Credit as the payment method.' },
      { step: 5, title: 'Crate Check (if applicable)', description: 'If the cart contains crate products, you\'ll be asked how many empty crates the customer brought. Enter the number — any shortfall will automatically add a deposit charge.' },
      { step: 6, title: 'Complete Sale', description: 'Click "Complete Sale" to finalize. A receipt will be generated that you can print.' },
    ],
  },
  {
    id: 'manage-crates',
    title: 'Manage Crate Returns & Deposits',
    icon: PackageOpen,
    description: 'Handle crate returns and refund deposits to customers.',
    steps: [
      { step: 1, title: 'Go to Crates Page', description: 'Click "Crates" in the sidebar to open the crate management page.' },
      { step: 2, title: 'View Pending Deposits', description: 'You\'ll see a list of all pending crate deposits — customers who owe crates and paid a deposit.' },
      { step: 3, title: 'Customer Returns Crates', description: 'When a customer comes back with empty crates and their receipt, find their deposit in the list.' },
      { step: 4, title: 'Mark as Returned', description: 'Click "Return" on the deposit entry. This will mark the crates as returned and the deposit as refunded.' },
      { step: 5, title: 'Crate Inventory Updates', description: 'The crate inventory (empty/filled counts) updates automatically when sales are made and crates are returned.' },
    ],
  },
  {
    id: 'credit-sales',
    title: 'Record & Track Credit Sales',
    icon: CreditCard,
    description: 'Sell on credit and track payments from customers.',
    steps: [
      { step: 1, title: 'Make a Credit Sale', description: 'In POS, select "Credit" as the payment method before completing the sale.' },
      { step: 2, title: 'Select a Customer', description: 'You\'ll be prompted to select an existing customer or create a new one. Credit sales must be linked to a customer.' },
      { step: 3, title: 'View Credit Sales', description: 'Go to "Credit Sales" in the sidebar to see all outstanding credit balances.' },
      { step: 4, title: 'Record a Payment', description: 'When a customer makes a payment, click on their credit entry and record the payment amount.' },
      { step: 5, title: 'Track Balance', description: 'The system automatically calculates remaining balance and marks the sale as paid when fully settled.' },
    ],
  },
  {
    id: 'add-staff',
    title: 'Add & Manage Staff',
    icon: Users,
    description: 'Add cashiers and managers with role-based access control.',
    steps: [
      { step: 1, title: 'Go to Staff Page', description: 'Click "Staff" in the sidebar (only visible to owners and managers).' },
      { step: 2, title: 'Click "Add Staff"', description: 'Click the "Add Staff" button to open the staff creation form.' },
      { step: 3, title: 'Enter Staff Details', description: 'Enter the staff member\'s full name, email address, phone number, and a temporary password.' },
      { step: 4, title: 'Choose a Role', description: 'Select either "Manager" or "Cashier" as their role. Managers have more permissions than cashiers.' },
      { step: 5, title: 'Staff Logs In', description: 'The staff member can now log in with their email and password to access the system with their assigned permissions.' },
    ],
  },
  {
    id: 'restock-inventory',
    title: 'Restock / Add Inventory',
    icon: Package,
    description: 'Add stock when new products arrive at your store.',
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click "Inventory" in the sidebar.' },
      { step: 2, title: 'Find the Product', description: 'Search or scroll to find the product you want to restock.' },
      { step: 3, title: 'Click "Add Stock"', description: 'Click the "Add Stock" or restock button on the product card.' },
      { step: 4, title: 'Enter Quantity', description: 'Enter the number of units you\'re adding to stock and optionally a reason (e.g. "New shipment").' },
      { step: 5, title: 'Confirm', description: 'Click confirm. The stock level will be updated immediately and the inflow will be recorded in history.' },
    ],
  },
  {
    id: 'view-reports',
    title: 'View Sales Reports & Dashboard',
    icon: BarChart3,
    description: 'Monitor your business performance with sales data and charts.',
    steps: [
      { step: 1, title: 'Go to Dashboard', description: 'Click "Dashboard" in the sidebar to see your business overview.' },
      { step: 2, title: 'View Key Metrics', description: 'See today\'s sales, total revenue, top products, and other key performance indicators at a glance.' },
      { step: 3, title: 'Sales History', description: 'Click "Sales History" in the sidebar for a detailed list of all transactions with filters by date, payment method, and cashier.' },
      { step: 4, title: 'View Receipts', description: 'Click on any sale in the history to view or reprint the receipt.' },
    ],
  },
  {
    id: 'store-settings',
    title: 'Configure Store Settings',
    icon: Settings,
    description: 'Customize your store name, receipt layout, and other preferences.',
    steps: [
      { step: 1, title: 'Go to Store Settings', description: 'Click "Store Settings" in the sidebar (owner only).' },
      { step: 2, title: 'Update Store Info', description: 'Change your store name, address, and phone number.' },
      { step: 3, title: 'Customize Receipts', description: 'Set a custom receipt header and footer message. Toggle whether to show address and phone on receipts.' },
      { step: 4, title: 'Printer Setup', description: 'Select your printer type (thermal or regular) for receipt printing.' },
      { step: 5, title: 'Save Changes', description: 'Click "Save" to apply your changes.' },
    ],
  },
];

function GuideCard({ guide }: { guide: Guide }) {
  const [open, setOpen] = useState(false);
  const Icon = guide.icon;

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 sm:p-5 text-left"
      >
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-foreground">{guide.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">{guide.description}</p>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border"
        >
          <ol className="p-4 sm:p-5 space-y-4">
            {guide.steps.map((s) => (
              <li key={s.step} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{s.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
}

export default function HowToPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromApp = location.state?.fromApp;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(isFromApp ? -1 as any : '/')}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="font-bold text-lg">How To Guide</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Learn How to Use Lantid</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Step-by-step guides for everything you need to do on the platform. Click on any topic to expand the instructions.
          </p>
        </div>

        <div className="space-y-3">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </div>
  );
}
