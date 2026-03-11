import { create } from 'zustand';

interface ICartModifier {
    id: string;
    name: string;
    price: number;
    isExtra: boolean;
    isLight: boolean;
}

interface ICartItem {
    cartId: string;
    itemId: string;
    name: string;
    basePrice: number;
    modifiers: ICartModifier[];
    quantity: number;
    totalPrice: number;
}

interface ICartStore {
    items: ICartItem[];
    addItem: (item: Omit<ICartItem, 'cartId'>) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<ICartStore>((set) => ({
    items: [],
  
    addItem: (item) => set((state) => ({
      items: [...state.items, { ...item, cartId: crypto.randomUUID() }]
    })),
  
    removeItem: (cartId) => set((state) => ({
      items: state.items.filter(i => i.cartId !== cartId)
    })),
  
    updateQuantity: (cartId, quantity) => set((state) => ({
      items: state.items.map(i => i.cartId === cartId ? { ...i, quantity } : i)
    })),
  
    clearCart: () => set({ items: [] }),
  }));