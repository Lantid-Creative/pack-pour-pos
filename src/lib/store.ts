import { create } from 'zustand';
import { Product, OrderItem, Sale, InventoryInflow, PaymentMethod, UserRole } from './types';
import { defaultProducts } from './products';

interface AppState {
  // Auth
  currentRole: UserRole;
  currentUser: string;
  setRole: (role: UserRole, user?: string) => void;

  // Products
  products: Product[];
  updateProductStock: (productId: string, quantity: number) => void;

  // Cart
  cart: OrderItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Sales
  sales: Sale[];
  completeSale: (paymentMethod: PaymentMethod) => Sale | null;

  // Inventory
  inflows: InventoryInflow[];
  addInflow: (productId: string, quantity: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentRole: 'cashier',
  currentUser: 'Cashier 1',
  setRole: (role, user) => set({ currentRole: role, currentUser: user || (role === 'cashier' ? 'Cashier 1' : role === 'manager' ? 'Manager' : 'Owner') }),

  products: defaultProducts,
  updateProductStock: (productId, quantity) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      ),
    })),

  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity <= 0
        ? state.cart.filter((item) => item.product.id !== productId)
        : state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
    })),
  clearCart: () => set({ cart: [] }),

  sales: [],
  completeSale: (paymentMethod) => {
    const state = get();
    if (state.cart.length === 0) return null;
    const total = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const sale: Sale = {
      id: `S${Date.now()}`,
      items: [...state.cart],
      total,
      paymentMethod,
      cashier: state.currentUser,
      date: new Date().toLocaleDateString('en-NG'),
      timestamp: Date.now(),
    };
    // Reduce stock
    const updatedProducts = state.products.map((p) => {
      const cartItem = state.cart.find((item) => item.product.id === p.id);
      return cartItem ? { ...p, stock: p.stock - cartItem.quantity } : p;
    });
    set((s) => ({ sales: [sale, ...s.sales], cart: [], products: updatedProducts }));
    return sale;
  },

  inflows: [],
  addInflow: (productId, quantity) => {
    const state = get();
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    const inflow: InventoryInflow = {
      id: `I${Date.now()}`,
      productId,
      productName: product.name,
      quantity,
      date: new Date().toLocaleDateString('en-NG'),
      addedBy: state.currentUser,
    };
    set((s) => ({
      inflows: [inflow, ...s.inflows],
      products: s.products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      ),
    }));
  },
}));
