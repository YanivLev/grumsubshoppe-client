'use client'

import { useCartStore } from '@/app/store/cart.store';
import CartItem from '@/app/components/molecules/CartItem';
import { useState, useRef } from 'react';

export default function CartPanel() {
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const [isClosing, setIsClosing] = useState(false);
    const [dragY, setDragY] = useState(0);
    const [dragTransition, setDragTransition] = useState(false);
    const dragStartY = useRef(0);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (!isCartOpen) return null;

    function handleClose() {
        setIsClosing(true);
        setTimeout(() => {
          closeCart();
          setIsClosing(false);
        }, 480);
    }

    function handleTouchStart(e: React.TouchEvent) {
        dragStartY.current = e.touches[0].clientY;
        setDragTransition(false);
    }
    
    function handleTouchMove(e: React.TouchEvent) {
        const delta = e.touches[0].clientY - dragStartY.current;
        if (delta > 0) setDragY(delta);
    }

    function handleTouchEnd() {
        setDragTransition(true);
        if (dragY > 120) {
          setDragY(window.innerHeight);
          setTimeout(() => {
            closeCart();
            setDragY(0);
            setDragTransition(false);
          }, 480);
        } else {
          setDragY(0);
        }
    }

      return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
                onClick={handleClose}
            />
    
            <div
                style={dragY > 0 || dragTransition ? {
                    transform: `translateY(${dragY}px)`,
                    transition: dragTransition ? 'transform 0.48s ease-in-out' : 'none'
                } : {}}
                className={`fixed z-50 bg-white shadow-2xl flex flex-col
                    bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl
                    md:bottom-auto md:left-auto md:top-0 md:right-0 md:h-full md:w-full md:max-w-md md:rounded-none
                    ${dragY > 0
                        ? ''
                        : isClosing
                            ? isMobile ? 'animate-cart-out-bottom' : 'animate-cart-out-side'
                            : isMobile ? 'animate-cart-in-bottom'  : 'animate-cart-in-side'
                    }`}
            >
                <div
                    className="flex flex-col border-b border-gray-200 touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Drag indicator — mobile only */}
                    <div className="md:hidden flex justify-center pt-4 pb-1">
                        <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Title + close */}
                    <div className="flex justify-between items-center px-6 py-4 md:cursor-default cursor-grab active:cursor-grabbing">
                        <h1 className="text-2xl font-bold">Your Cart</h1>
                        <button
                            onClick={handleClose}
                            className="cursor-pointer text-gray-400 hover:text-black transition-colors"
                        >
                            <i className="bx bx-x text-3xl" />
                        </button>
                    </div>
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