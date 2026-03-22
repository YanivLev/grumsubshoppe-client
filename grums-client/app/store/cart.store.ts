import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ICartModifier {
    id: string;
    name: string;
    price: number;
    isDefault: boolean;
    isExtra: boolean;
    isLight: boolean;
    isReplacement: boolean;
    replacedName?: string;  
}

interface ICartItem {
    cartItemId: string;
    itemId: string;
    name: string;
    basePrice: number;
    modifiers: ICartModifier[];
    quantity: number;
    totalPrice: number;
    itemPath: string;
}

interface ICartStore {
    items: ICartItem[];
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<ICartItem, 'cartItemId'>) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    updateItem: (cartItemId: string, changes: Partial<Omit<ICartItem, 'cartItemId'>>) => void;
    clearCart: () => void;
  }

  function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

export const useCartStore = create<ICartStore>() (
    persist(
        (set) => ({
        items: [],
        isCartOpen: false,
        openCart: () => set({ isCartOpen: true }),
        closeCart: () => set({ isCartOpen: false }),
        addItem: (item) =>
            set((state) => {
            const match = state.items.find((i) => {
                if (i.itemId !== item.itemId) return false;
                if (i.modifiers.length !== item.modifiers.length) return false;
                const sortedA = [...i.modifiers].sort((a, b) => a.id.localeCompare(b.id));
                const sortedB = [...item.modifiers].sort((a, b) => a.id.localeCompare(b.id));
                return sortedA.every((mod, idx) =>
                mod.id === sortedB[idx].id &&
                mod.isExtra === sortedB[idx].isExtra &&
                mod.isLight === sortedB[idx].isLight
                );
            });
        
            if (match) {
                const newQuantity = match.quantity + item.quantity;
                return {
                items: state.items.map((i) =>
                    i.cartItemId === match.cartItemId
                    ? { ...i, quantity: newQuantity, totalPrice: Math.round((i.totalPrice / i.quantity) * newQuantity) }
                    : i
                ),
                };
            }
        
            return {
                items: [...state.items, { ...item, cartItemId: generateId() }],
            };
            }),      
        removeItem: (cartItemId) =>
        set((state) => ({
            items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),
        updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
            items: state.items.map((i) =>
            i.cartItemId === cartItemId
                ? { ...i, quantity, totalPrice: Math.round((i.totalPrice / i.quantity) * quantity) }
                : i
            ),
        })),
        updateItem: (cartItemId: string, item) =>
            set((state) => ({
            items: state.items.map((i) =>
                i.cartItemId === cartItemId ? { ...i, ...item } : i
            ),
            })),
        clearCart: () => set({ items: [] }),
    }),
    {
        name: 'grums-cart'
      }
    )
);