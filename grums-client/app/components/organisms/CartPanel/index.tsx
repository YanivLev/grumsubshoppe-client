'use client'

import { useCartStore } from '@/app/store/cart.store';
import CartItem from '@/app/components/molecules/CartItem';
import { useState } from 'react';

export default function CartPanel() {
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const [isClosing, setIsClosing] = useState(false);
    if (!isCartOpen) return null;

    function handleClose() {
        setIsClosing(true);
        setTimeout(() => {
          closeCart();
          setIsClosing(false);
        }, 280);
    }

    return (
        <>
        <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
        />

        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col ${isClosing ? 'animate-slide-out' : 'animate-slide-in'}`}>

            <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Your Cart</h1>
            <button
                onClick={handleClose}
                className="cursor-pointer text-gray-400 hover:text-black transition-colors"
            >
                <i className="bx bx-x text-3xl" />
            </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                <p className="text-xl">Your cart is empty</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                {items.map((item) => (
                    <CartItem
                    key={item.cartId}
                    cartId={item.cartId}
                    name={item.name}
                    modifiers={item.modifiers}
                    quantity={item.quantity}
                    totalPrice={item.totalPrice}
                    />
                ))}
                </div>
            )}
            </div>

            {items.length > 0 && (
            <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold">${(total / 100).toFixed(2)}</span>
                </div>
                <button
                onClick={clearCart}
                className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                Place Order
                </button>
            </div>
            )}
        </div>
        </>
    );
}
