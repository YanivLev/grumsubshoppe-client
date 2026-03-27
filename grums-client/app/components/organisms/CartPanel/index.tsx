'use client'

import { useCartStore } from '@/app/store/cart.store';
import CartItem from '@/app/components/molecules/CartItem';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();


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

    function handlePlaceOrder() {
        clearCart();
        router.push('/order')
        
    }

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
      
        if (!isCartOpen) {
          setIsVisible(false);
          return;
        }
        const t = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(t);
      }, [isCartOpen]);
    
    if (!isCartOpen && !isVisible && !isClosing) return null;

      return (
        <>
           <div
                style={{
                    opacity: dragY > 0
                        ? Math.max(0, 1 - dragY / window.innerHeight)
                        : isClosing || !isVisible ? 0 : 1,
                    transition: dragY > 0
                        ? 'none'
                        : dragTransition
                            ? 'opacity 0.48s ease-in-out'
                            : 'opacity 0.5s ease-out',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}
                className="fixed inset-0 z-40"
                onClick={handleClose}
            />
    
            <div
                style={{
                    transform: dragY > 0
                      ? `translateY(${dragY}px)`
                      : isClosing || !isVisible
                        ? isMobile ? 'translateY(100%)' : 'translateX(100%)'
                        : isMobile ? 'translateY(0)' : 'translateX(0)',
                    transition: dragY > 0
                      ? 'none'
                      : dragTransition
                        ? 'transform 0.4s ease-in-out'
                        : 'transform 0.4s ease-out'
                  }}
                  className="fixed z-50 bg-white shadow-2xl flex flex-col
                    bottom-0 left-0 right-0 h-[85vh] rounded-t-2xl
                    lg:bottom-auto lg:left-auto lg:top-0 lg:right-0 lg:h-full lg:w-full lg:max-w-md lg:rounded-none"
            >

                <div
                    className="flex flex-col border-b border-gray-200 touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Drag indicator — mobile only */}
                    <div className="lg:hidden flex justify-center pt-4 pb-1">
                        <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    {/* Title + close */}
                    <div className="flex justify-between items-center px-6 py-4 lg:cursor-default cursor-grab active:cursor-grabbing">
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
                                    key={item.cartItemId}
                                    cartItemId={item.cartItemId}
                                    name={item.name}
                                    modifiers={item.modifiers}
                                    quantity={item.quantity}
                                    totalPrice={item.totalPrice}
                                    itemPath = {item.itemPath}
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
                            onClick={handlePlaceOrder}
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