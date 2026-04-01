'use client'

import { useCartStore } from '@/app/store/cart.store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ICartItemProps {
    cartItemId: string;
    name: string;
    modifiers: {id: string, name: string, isDefault: boolean, isExtra: boolean, isLight: boolean, isReplacement: boolean, replacedName?: string}[];
    quantity: number;
    totalPrice: number;
    itemPath: string;
    note?: string;
}

export default function CartItem({ cartItemId, name, modifiers, quantity, totalPrice, itemPath, note}: ICartItemProps) {
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const [expanded, setExpanded] = useState(false);
    const closeCart = useCartStore((state) => state.closeCart);
    const router = useRouter();

    function handleEdit() {
        console.log('itemPath in CartItem:', itemPath);
        closeCart();
        router.push(`${itemPath}&edit=${cartItemId}`);
      }

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <span className="font-bold text-lg">{quantity}x {name}</span>
                <div className="flex items-center gap-1 ">
                    <button onClick={handleEdit} className="text-gray-400 hover:text-green-500 transition-colors cursor-pointer">
                        <i className="bx bx-edit text-2xl md:text-xl" />
                    </button>
                    <button
                        onClick={() => removeItem(cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <i className="bx bx-trash text-2xl md:text-xl" />
                    </button>

                </div>

            </div>
    
            {modifiers.length > 0 && (
                <ul className="text-sm text-gray-500 space-y-0.5">
                    {(expanded ? modifiers : modifiers.slice(0, 3)).map((mod) => (
                    <li key={mod.id}>
                        {mod.isExtra && mod.isReplacement ? `Extra ${mod.name} instead of ${mod.replacedName}`
                        : mod.isLight && mod.isReplacement ? `Light ${mod.name} instead of ${mod.replacedName}`
                        : mod.isReplacement ? `${mod.name} instead of ${mod.replacedName}`
                        : mod.isExtra ? `Extra ${mod.name}`
                        : mod.isLight ? `Light ${mod.name}`
                        : mod.isDefault ? mod.name          // ← default ingredient, just show name
                        : `Add ${mod.name}` 
                        }
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

            {note && (
                <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2">"{note}"</p>
            )}

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                <button
                    onClick={() =>
                    quantity === 1 ? removeItem(cartItemId) : updateQuantity(cartItemId, quantity - 1)
                    }
                    className="font-bold text-lg cursor-pointer w-6 text-center"
                >
                    −
                </button>
                <span className="font-semibold w-4 text-center">{quantity}</span>
                <button
                    onClick={() => updateQuantity(cartItemId, quantity + 1)}
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