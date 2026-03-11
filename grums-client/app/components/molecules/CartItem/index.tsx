'use client'

import { useCartStore } from '@/app/store/cart.store';
import { useState } from 'react';

interface ICartItemProps {
    cartId: string;
    name: string;
    modifiers: {id: string, name: string, isExtra: boolean, isLight: boolean}[];
    quantity: number;
    totalPrice: number;
}

export default function CartItem({ cartId, name, modifiers, quantity, totalPrice}: ICartItemProps) {
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="font-bold text-lg">{name}</span>
                <button
                onClick={() => removeItem(cartId)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                <i className="bx bx-trash text-xl" />
                </button>
            </div>
    
            {modifiers.length > 0 && (
                <ul className="text-sm text-gray-500 space-y-0.5">
                    {(expanded ? modifiers : modifiers.slice(0, 3)).map((mod) => (
                    <li key={mod.id}>
                        {mod.isExtra ? `Extra ${mod.name}` : mod.isLight ? `Light ${mod.name}` : mod.name}
                    </li>
                    ))}
                    {modifiers.length > 3 && (
                    <li>
                        <button
                        onClick={() => setExpanded(v => !v)}
                        className="text-green-600 hover:underline font-bold cursor-pointer text-sm"
                        >
                        {expanded ? 'Show less' : `+${modifiers.length - 3} more`}
                        </button>
                    </li>
                    )}
                </ul>
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                <button
                    onClick={() =>
                    quantity === 1 ? removeItem(cartId) : updateQuantity(cartId, quantity - 1)
                    }
                    className="font-bold text-lg cursor-pointer w-6 text-center"
                >
                    −
                </button>
                <span className="font-semibold w-4 text-center">{quantity}</span>
                <button
                    onClick={() => updateQuantity(cartId, quantity + 1)}
                    className="font-bold text-lg cursor-pointer w-6 text-center"
                >
                    +
                </button>
                </div>
                <span className="font-bold text-lg">${(totalPrice / 100).toFixed(2)}</span>
            </div>
        </div>
    );
}