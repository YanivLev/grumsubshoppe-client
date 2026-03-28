'use client'

import { useCartStore } from '@/app/store/cart.store';


export default function CartIcon() {
    const openCart = useCartStore((state) => state.openCart);
    const itemCount = useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));

    return (
        <button
          onClick={openCart}
          className="relative cursor-pointer rounded-full border border-gray-500 lg:border-gray-300 hover:bg-gray-50 w-10 h-10 flex items-center justify-center transition-colors"
        >
          <i className="bx bx-cart text-xl leading-[0]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </button>
    );
}