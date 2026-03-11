'use client'

import { useCartStore } from '@/app/store/cart.store';
import { useRouter } from 'next/navigation';

export default function CartIcon() {
    const router = useRouter();
    const itemCount = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0));

    return (
        <button onClick={() => router.push('/cart')}
                className="relative cursor-pointer rounded-full border border-gray-300 hover:bg-gray-50 p-2"
        >
            <i className="bx bx-cart text-[20px]" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    )
}