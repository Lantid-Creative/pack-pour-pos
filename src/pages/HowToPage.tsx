import { useState } from 'react';
import { ChevronDown, ChevronRight, Package, ShoppingCart, PackageOpen, Users, CreditCard, BarChart3, Settings, BookOpen, ArrowLeft, Play } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOnboarding, TourStep } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';

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
  tourRoute?: string;
  tourSteps?: TourStep[];
}

const guides: Guide[] = [
  {
    id: 'create-product',
    title: 'Create a Normal Product',
    icon: Package,
    description: 'Add a new product to your inventory that is not a crate product.',
    tourRoute: '/inventory',
    tourSteps: [
      { targetId: 'nav-inventory', title: 'Go to Inventory', description: 'Click "Inventory" in the sidebar to open the inventory management page.', position: 'right' },
      { targetId: 'tour-create-product-btn', title: 'Click "Create"', description: 'Click the "Create" button to open the new product form. You can also use "Library" to pick from pre-made products.', position: 'bottom' },
      { targetId: 'tour-inventory-search', title: 'Search Products', description: 'Use the search bar to quickly find products in your inventory by name.', position: 'bottom' },
    ],
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click on "Inventory" in the sidebar navigation to open the inventory management page.' },
      { step: 2, title: 'Click "Create"', description: 'Click the "Create" button at the top of the inventory page.' },
      { step: 3, title: 'Fill in Product Details', description: 'Enter the product name, category, pack size (e.g. "Pack of 12"), selling price, and cost price.' },
      { step: 4, title: 'Set Stock & Threshold', description: 'Enter the initial stock quantity and set a low-stock threshold so you get alerted when stock is running low.' },
      { step: 5, title: 'Leave Crate Toggle Off', description: 'Make sure the "Crate Product" toggle is turned OFF for a normal product.' },
      { step: 6, title: 'Save', description: 'Click "Create Product" to save. Your product will now appear in the inventory list and be available in POS.' },
    ],
  },
  {
    id: 'create-crate-product',
    title: 'Create a Crate Product',
    icon: PackageOpen,
    description: 'Add a product that uses returnable crates with a deposit system.',
    tourRoute: '/inventory',
    tourSteps: [
      { targetId: 'nav-inventory', title: 'Go to Inventory', description: 'Click "Inventory" in the sidebar to manage your products.', position: 'right' },
      { targetId: 'tour-create-product-btn', title: 'Click "Create"', description: 'Click "Create" to open the product form. You\'ll enable the "Crate Product" toggle inside.', position: 'bottom' },
      { targetId: 'nav-crates', title: 'Set Up Crate Inventory', description: 'After creating, go to "Crates" in the sidebar to set up total, filled, and empty crate counts.', position: 'right' },
    ],
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click on "Inventory" in the sidebar navigation.' },
      { step: 2, title: 'Click "Create"', description: 'Click the "Create" button at the top of the page.' },
      { step: 3, title: 'Fill in Product Details', description: 'Enter the product name, category, pack size, selling price, and cost price as usual.' },
      { step: 4, title: 'Enable Crate Product', description: 'Turn ON the "Crate Product" toggle. A new field will appear for the deposit amount.' },
      { step: 5, title: 'Set Deposit Amount', description: 'Enter the deposit amount customers pay per crate if they don\'t bring empty crates.' },
      { step: 6, title: 'Save the Product', description: 'Click "Create Product" to save.' },
      { step: 7, title: 'Set Up Crate Inventory', description: 'Go to the "Crates" page from the sidebar. Click "Add Product", select your new crate product, and enter the total crates, filled crates, and empty crates you have.' },
    ],
  },
  {
    id: 'make-sale',
    title: 'Make a Sale (POS)',
    icon: ShoppingCart,
    description: 'Process a sale using the Point of Sale terminal.',
    tourRoute: '/pos',
    tourSteps: [
      { targetId: 'nav-pos', title: 'Open POS Terminal', description: 'Click "POS Terminal" in the sidebar to start selling.', position: 'right' },
      { targetId: 'tour-pos-header', title: 'POS Interface', description: 'Browse or search products on the left. Your cart and checkout are on the right. Tap products to add them to the cart.', position: 'bottom' },
    ],
    steps: [
      { step: 1, title: 'Open POS', description: 'Click "POS Terminal" in the sidebar to open the point of sale screen.' },
      { step: 2, title: 'Search or Browse Products', description: 'Use the search bar to find products, or browse by category. Click on a product to add it to the cart.' },
      { step: 3, title: 'Adjust Quantities', description: 'Use the + and − buttons in the cart to adjust how many units the customer wants.' },
      { step: 4, title: 'Choose Payment Method', description: 'Select Cash, POS, Transfer, or Credit as the payment method.' },
      { step: 5, title: 'Crate Check (if applicable)', description: 'If the cart contains crate products, you\'ll be asked how many empty crates the customer brought. Any shortfall automatically adds a deposit charge.' },
      { step: 6, title: 'Complete Sale', description: 'Click "Complete Sale" to finalize. A receipt will be generated that you can print.' },
    ],
  },
  {
    id: 'manage-crates',
    title: 'Manage Crate Returns & Deposits',
    icon: PackageOpen,
    description: 'Handle crate returns and refund deposits to customers.',
    tourRoute: '/crates',
    tourSteps: [
      { targetId: 'nav-crates', title: 'Go to Crates Page', description: 'Click "Crates" in the sidebar to manage crate deposits and returns.', position: 'right' },
      { targetId: 'tour-crate-inventory', title: 'Crate Inventory', description: 'This section shows your crate stock levels — total, filled, and empty crates for each product. Click the edit icon to update counts.', position: 'bottom' },
      { targetId: 'tour-crate-deposits', title: 'Pending Deposits', description: 'Below you\'ll see all pending crate deposits. When a customer returns crates with their receipt, click "Return" to process the refund.', position: 'top' },
    ],
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
    tourRoute: '/credit-sales',
    tourSteps: [
      { targetId: 'nav-pos', title: 'Start at POS', description: 'Go to POS Terminal to make a sale. Select "Credit" as the payment method before completing.', position: 'right' },
      { targetId: 'nav-credit', title: 'View Credit Sales', description: 'Click "Credit Sales" in the sidebar to see all outstanding credit balances and record payments.', position: 'right' },
    ],
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
    tourRoute: '/staff',
    tourSteps: [
      { targetId: 'nav-staff', title: 'Go to Staff Page', description: 'Click "Staff" in the sidebar to manage your team members.', position: 'right' },
      { targetId: 'tour-add-staff-btn', title: 'Add New Staff', description: 'Click "Add Staff" to create a new staff account. Enter their name, email, and choose a role (Cashier or Manager).', position: 'bottom' },
      { targetId: 'tour-staff-tabs', title: 'Manage Permissions', description: 'Switch to the "Permissions" tab to customize what each role can access in the system.', position: 'bottom' },
    ],
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
    tourRoute: '/inventory',
    tourSteps: [
      { targetId: 'nav-inventory', title: 'Go to Inventory', description: 'Click "Inventory" in the sidebar to see all your products.', position: 'right' },
      { targetId: 'tour-inventory-search', title: 'Find Your Product', description: 'Search for the product you want to restock. On each product card, click "+ Add" to add stock or "- Remove" to reduce it.', position: 'bottom' },
    ],
    steps: [
      { step: 1, title: 'Go to Inventory', description: 'Click "Inventory" in the sidebar.' },
      { step: 2, title: 'Find the Product', description: 'Search or scroll to find the product you want to restock.' },
      { step: 3, title: 'Click "+ Add"', description: 'Click the "+ Add" button on the product card.' },
      { step: 4, title: 'Enter Quantity', description: 'Enter the number of units you\'re adding to stock and optionally a reason (e.g. "New shipment").' },
      { step: 5, title: 'Confirm', description: 'Click confirm. The stock level will be updated immediately and the inflow will be recorded in history.' },
    ],
  },
  {
    id: 'view-reports',
    title: 'View Sales Reports & Dashboard',
    icon: BarChart3,
    description: 'Monitor your business performance with sales data and charts.',
    tourRoute: '/dashboard',
    tourSteps: [
      { targetId: 'nav-dashboard', title: 'Open Dashboard', description: 'Click "Dashboard" in the sidebar to see your business overview.', position: 'right' },
      { targetId: 'tour-time-range', title: 'Filter by Time', description: 'Use these filters to view data for Today, This Week, This Month, or a custom date range.', position: 'bottom' },
      { targetId: 'tour-metrics-row', title: 'Key Metrics', description: 'These cards show your Revenue, Profit, Total Sales, Average Order Value, and Low Stock alerts at a glance.', position: 'bottom' },
      { targetId: 'nav-sales', title: 'Sales History', description: 'Click "Sales History" for a detailed list of every transaction, with filters and receipt reprinting.', position: 'right' },
    ],
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
    tourRoute: '/settings',
    tourSteps: [
      { targetId: 'nav-settings', title: 'Open Store Settings', description: 'Click "Store Settings" in the sidebar (owner only).', position: 'right' },
      { targetId: 'tour-store-details', title: 'Store Details', description: 'Update your store name, address, and phone number here. You can also customize receipt headers, footers, and choose your printer type.', position: 'right' },
    ],
    steps: [
      { step: 1, title: 'Go to Store Settings', description: 'Click "Store Settings" in the sidebar (owner only).' },
      { step: 2, title: 'Update Store Info', description: 'Change your store name, address, and phone number.' },
      { step: 3, title: 'Customize Receipts', description: 'Set a custom receipt header and footer message. Toggle whether to show address and phone on receipts.' },
      { step: 4, title: 'Printer Setup', description: 'Select your printer type (thermal or regular) for receipt printing.' },
      { step: 5, title: 'Save Changes', description: 'Click "Save" to apply your changes.' },
    ],
  },
];

function GuideCard({ guide, onStartTour }: { guide: Guide; onStartTour: (guide: Guide) => void }) {
  const [open, setOpen] = useState(false);
  const Icon = guide.icon;
  const hasTour = guide.tourSteps && guide.tourSteps.length > 0;

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
          {/* Interactive walkthrough button */}
          {hasTour && (
            <div className="px-4 sm:px-5 pt-4">
              <button
                onClick={() => onStartTour(guide)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all w-full sm:w-auto justify-center sm:justify-start"
              >
                <Play className="h-4 w-4" />
                Start Interactive Walkthrough
              </button>
              <p className="text-xs text-muted-foreground mt-1.5 mb-2">
                We'll guide you through the actual interface step by step.
              </p>
            </div>
          )}

          <div className="px-4 sm:px-5 pt-2 pb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Step-by-step instructions</p>
          </div>
          <ol className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
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
  const { user } = useAuth();
  const onboarding = user ? null : undefined; // Only try to use onboarding context if logged in

  const handleStartTour = (guide: Guide) => {
    if (!guide.tourSteps || !guide.tourRoute) return;
    if (!user) {
      // Not logged in — redirect to login
      navigate('/login');
      return;
    }
    // Navigate to the target route, then start the tour
    navigate(guide.tourRoute, { state: { guideTour: guide.tourSteps } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
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
            Step-by-step guides for everything you need to do on the platform. Click any topic to see the instructions, or use the <strong>interactive walkthrough</strong> to be guided through the real interface.
          </p>
        </div>

        <div className="space-y-3">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} onStartTour={handleStartTour} />
          ))}
        </div>
      </div>
    </div>
  );
}
