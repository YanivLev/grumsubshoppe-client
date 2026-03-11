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
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<ICartItem, 'cartId'>) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
  }

  export const useCartStore = create<ICartStore>((set) => ({
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
                i.cartId === match.cartId
                  ? { ...i, quantity: newQuantity, totalPrice: Math.round((i.totalPrice / i.quantity) * newQuantity) }
                  : i
              ),
            };
          }
      
          return {
            items: [...state.items, { ...item, cartId: crypto.randomUUID() }],
          };
        }),      
    removeItem: (cartId) =>
      set((state) => ({
        items: state.items.filter((i) => i.cartId !== cartId),
      })),
    updateQuantity: (cartId, quantity) =>
      set((state) => ({
        items: state.items.map((i) =>
          i.cartId === cartId
            ? { ...i, quantity, totalPrice: Math.round((i.totalPrice / i.quantity) * quantity) }
            : i
        ),
      })),
    clearCart: () => set({ items: [] }),
  }));