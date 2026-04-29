'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICartItem } from '@/app/store/cart.store';

interface LastOrder {
    items: ICartItem[];
    total: number;
    tipAmount: number;
    pickupNote: string;
    customerName: string;
}

export default function OrderConfirmedPage() {
    const router = useRouter();
    const [order, setOrder] = useState<LastOrder | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem('lastOrder');
        if (!raw) { router.replace('/'); return; }
        setOrder(JSON.parse(raw));
    }, [router]);

    if (!order) return null;

    const gross = order.total + order.tipAmount;

    return (
        <div className="flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">

                {/* Success icon */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Order Placed!</h1>
                    <p className="text-sm text-gray-500 mt-1">Thanks {order.customerName}, we'll have it ready for you.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                    {/* Pickup time */}
                    <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="text-xs text-green-700 font-medium uppercase tracking-wider">Pickup</p>
                            <p className="text-sm font-semibold text-green-900">{order.pickupNote}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-4 flex flex-col gap-3">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Order</h2>
                        {order.items.map((item) => {
                            const modifierLabels = [
                                ...item.modifiers
                                    .filter(m => !m.isDefault || m.isExtra || m.isLight)
                                    .map(m => {
                                        if (m.isExtra) return `Extra ${m.name}`;
                                        if (m.isLight) return `Light ${m.name}`;
                                        if (m.isReplacement && m.replacedName) return `${m.name} instead of ${m.replacedName}`;
                                        return `Add ${m.name}`;
                                    }),
                                ...(item.removedModifiers ?? []).map(m => `No ${m.name}`),
                            ];
                            const note = item.note?.split('\n').find(l => l.startsWith('\x1F'))?.slice(1);
                            return (
                                <div key={item.cartItemId} className="flex justify-between gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-900">{item.quantity}× {item.name}</span>
                                        {modifierLabels.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-0.5">{modifierLabels.join(', ')}</p>
                                        )}
                                        {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
                                    </div>
                                    <span className="text-gray-700 shrink-0">${(item.totalPrice / 100).toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-2 bg-gray-50">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span>${(order.total / 100).toFixed(2)}</span>
                        </div>
                        {order.tipAmount > 0 && (
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tip</span>
                                <span>${(order.tipAmount / 100).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>${(gross / 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/')}
                    className="mt-6 w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                    Back to Menu
                </button>

            </div>
        </div>
    );
}
