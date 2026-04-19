'use client'

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/app/store/cart.store';
import { getApiKey } from '@/app/actions/payment/get-api-key';
import { createOrder } from '@/app/actions/order/create-order';
import { pay } from '@/app/actions/payment/pay';
import { useRouter } from 'next/navigation';
import { ICloverSDK } from '@/app/common/interfaces/clover-sdk.interface';
import { createCustomer } from '@/app/actions/customer/create-customer';
import { ICustomer } from '@/app/common/interfaces/customer.interface';

declare global {
    interface Window {
        Clover: new (apiAccessKey: string) => ICloverSDK;
    }
}

const TIP_OPTIONS = [10, 15, 18, 20];
const MAX_TIP = 999;

const cloverStyles = {
    body: {
        fontFamily: 'Roboto, Open Sans, sans-serif',
        fontSize: '21px',
        overflow: 'hidden',
    },
    input: {
        fontSize: '15px',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        color: '#727272',
        border: 'none',
        height: '40px',
        padding: '0 12px',
        lineHeight: '40px',
        maxHeight: '40px',
        overflow: 'hidden',
    },
    'input:focus': {
        outline: 'none',
    },
    '.brand': {
        maxHeight: '40px',
        height: '100%',
        width: 'auto',
    }
};

const inputCls = 'border border-gray-300 rounded-md h-10 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-shadow';
const fieldCls = 'block w-full px-3 h-10 border border-gray-300 rounded-md text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-black focus:border-black transition-shadow placeholder:text-gray-400';

export default function OrderPage() {
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const router = useRouter();

    const [tipPercent, setTipPercent] = useState<number>(0);
    const [customTip, setCustomTip] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const hasHydrated = useCartStore((state) => state.hasHydrated);
    const cloverRef = useRef<ICloverSDK | null>(null);

    const [customerInfo, setCustomerInfo] = useState<ICustomer>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    function handleCustomerChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    }

    const tipAmount = tipPercent > 0
        ? Math.round(total * tipPercent / 100)
        : customTip ? Math.round(parseFloat(customTip) * 100) : 0;

    const grossTotal = total + tipAmount;

    useEffect(() => {
        if (!hasHydrated) return;
        if (cloverRef.current) return;

        async function initClover() {
            const data = await getApiKey();
            const cardNumberEl = document.getElementById('card-number');
            if (!cardNumberEl || cardNumberEl.children.length > 0) return;

            const existingScript = document.querySelector(`script[src="${process.env.NEXT_PUBLIC_CLOVER_CHECKOUT_URL}"]`);

            function mountFields() {
                const clover = new window.Clover(data.apiAccessKey);
                cloverRef.current = clover;
                const elements = clover.elements();
                elements.create('CARD_NUMBER', cloverStyles).mount('#card-number');
                elements.create('CARD_DATE', cloverStyles).mount('#card-date');
                elements.create('CARD_CVV', cloverStyles).mount('#card-cvv');
                elements.create('CARD_POSTAL_CODE', cloverStyles).mount('#card-zip');
                elements.create('CARD_NAME', cloverStyles).mount('#card-name');
                elements.create('CARD_STREET_ADDRESS', cloverStyles).mount('#card-street-address');
            }

            if (existingScript) {
                if (window.Clover) {
                    mountFields();
                } else {
                    existingScript.addEventListener('load', mountFields);
                }
                return;
            }
            const script = document.createElement('script');
            script.src = process.env.NEXT_PUBLIC_CLOVER_CHECKOUT_URL!;
            script.onload = () => {
                const el = document.getElementById('card-number');
                if (!el || el.children.length > 0) return;
                mountFields();
            };
            document.head.appendChild(script);
        }

        initClover();
    }, [hasHydrated]);

    async function handlePay() {
        if (!cloverRef.current) return;
        setIsLoading(true);
        setError('');
        try {
            const { token } = await cloverRef.current.createToken();
            if (!token) throw new Error('Card tokenization failed');
            const customer = await createCustomer(customerInfo);
            const order = await createOrder(items, customer.id);
            await pay({ orderId: order.id, source: token, amount: total, tipAmount });
            clearCart();
            router.push('/order/confirmation');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong with the payment');
        } finally {
            setIsLoading(false);
        }
    }

    if (!hasHydrated) return null;
    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-16">

                <h1 className="text-2xl font-semibold text-gray-900 mb-10">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* ── Left: form ── */}
                    <div className="flex-1 flex flex-col gap-8">

                        {/* Customer Info */}
                        <section>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Info</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={customerInfo.firstName}
                                        onChange={handleCustomerChange}
                                        placeholder="Jane"
                                        className={fieldCls}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={customerInfo.lastName}
                                        onChange={handleCustomerChange}
                                        placeholder="Doe"
                                        className={fieldCls}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerInfo.email}
                                        onChange={handleCustomerChange}
                                        placeholder="jane@example.com"
                                        className={fieldCls}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={customerInfo.phoneNumber}
                                        onChange={handleCustomerChange}
                                        placeholder="(555) 000-0000"
                                        className={fieldCls}
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-200" />

                        {/* Tip */}
                        <section>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tip</h2>
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {TIP_OPTIONS.map((pct) => (
                                    <button
                                        key={pct}
                                        onClick={() => { setTipPercent(tipPercent === pct ? 0 : pct); setCustomTip(''); }}
                                        className={`flex flex-col items-center py-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                                            tipPercent === pct
                                                ? 'border-gray-900 bg-green-700 text-white'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        <span>{pct}%</span>
                                        <span className={`text-xs mt-0.5 font-normal ${tipPercent === pct ? 'text-white' : 'text-gray-400'}`}>
                                            ${(Math.round(total * pct / 100) / 100).toFixed(2)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
                                <input
                                    type="number"
                                    placeholder="Custom amount"
                                    value={customTip}
                                    onChange={(e) => {
                                        const tip_val = e.target.value;
                                        const digits = tip_val.replace('.', '').replace('-', '');
                                        if (digits.length > 4) return;
                                        const num_tip = parseFloat(tip_val);
                                        if (!isNaN(num_tip) && (num_tip < 0 || num_tip > MAX_TIP)) return;
                                        setCustomTip(tip_val);
                                        setTipPercent(0);
                                    }}
                                    className="w-full h-12 pl-8 pr-4 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow placeholder:text-gray-400"
                                />
                            </div>
                        </section>

                        <hr className="border-gray-200" />

                        {/* Card Details */}
                        <section>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Card Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={inputCls}>
                                    <div id="card-number" className="h-full" />
                                </div>
                                <div className={inputCls}>
                                    <div id="card-name" className="h-full" />
                                </div>
                                <div className={inputCls}>
                                    <div id="card-date" className="h-full" />
                                </div>
                                <div className={inputCls}>
                                    <div id="card-cvv" className="h-full" />
                                </div>
                                <div className={inputCls}>
                                    <div id="card-zip" className="h-full" />
                                </div>
                                <div className={inputCls}>
                                    <div id="card-street-address" className="h-full" />
                                </div>
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Your payment info is encrypted and never stored on our servers.
                            </p>
                        </section>

                    </div>

                    {/* ── Right: order summary ── */}
                    <div className="w-full lg:w-96 lg:sticky lg:top-8">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                            <div className="p-6 flex flex-col gap-3">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order summary</h2>
                                <div className="flex flex-col gap-2.5 mt-1">
                                    {items.map((item) => (
                                        <div key={item.cartItemId} className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-600">
                                                <span className="font-medium text-gray-900">{item.quantity}×</span> {item.name}
                                            </span>
                                            <span className="font-medium text-gray-900 shrink-0">${(item.totalPrice / 100).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-2 bg-gray-50">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${(total / 100).toFixed(2)}</span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Tip {tipPercent > 0 ? `(${tipPercent}%)` : ''}</span>
                                        <span>${(tipAmount / 100).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>${(grossTotal / 100).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="px-6 pb-6 pt-4 flex flex-col gap-3">
                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                                )}
                                <button
                                    onClick={handlePay}
                                    disabled={isLoading || items.length === 0}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-lg text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        `Pay $${(grossTotal / 100).toFixed(2)}`
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400">Secured by Clover</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
