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
import { linkCustomerToOrder } from '../actions/order/link-customer-order';
import { deleteOrder } from '../actions/order/delete-order';
import { deleteCustomer } from '../actions/customer/delete-customer';
import { sendEmail } from '../actions/email/send-email';
import { buildOrderEmailHtml } from '../common/util/order-email';
import TipOption from '../components/molecules/TipOption';
import DayButton from '../components/molecules/DayButton';
import CustomerInfoForm from '../components/organisms/CustomerInfoForm';
import PickupTimeSelector from '../components/organisms/PickupTimeSelector';
import TipSelector from '../components/organisms/TipSelector';

declare global {
    interface Window {
        Clover: new (apiAccessKey: string) => ICloverSDK;
    }
}

const TIP_OPTIONS = [10, 15, 18, 20];
const MAX_TIP = 999;

function getNowEastern(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
}

function getDayOptions() {
    return Array.from({ length: 4 }, (_, i) => {
        const d = getNowEastern();
        d.setDate(d.getDate() + i);
        const label = i == 0 ? 'Today' : i == 1 ? 'Tomorrow' : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        return { offset: i, label };
    });
}

function getPickupTimeSlots(dayOffset: number): { value: string; label: string }[] {
    const slots = [];
    const currTime = getNowEastern();
    let startTime: Date;

    if (dayOffset === 0) {
        const orderCutoff = new Date(currTime);
        orderCutoff.setHours(17, 0, 0, 0);
        if (currTime >= orderCutoff) return [];

        startTime = new Date(currTime.getTime() + 20 * 60 * 1000);
        startTime.setSeconds(0, 0);
        const rem = startTime.getMinutes() % 15;
        if (rem !== 0) startTime.setMinutes(startTime.getMinutes() + (15 - rem));
        const noon = new Date(currTime);
        noon.setHours(12, 0, 0, 0);
        if (startTime < noon) startTime = noon;
    } else {
        startTime = new Date(currTime);
        startTime.setDate(startTime.getDate() + dayOffset);
        startTime.setHours(12, 0, 0, 0);
    }

    const cutoff = new Date(startTime);
    cutoff.setHours(17, 30, 0, 0);

    for (let i = 0; ; i++) {
        const d = new Date(startTime.getTime() + i * 15 * 60 * 1000);
        if (d > cutoff) break;
        const h = d.getHours();
        const m = d.getMinutes();
        const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const label = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        slots.push({ value, label });
    }
    return slots;
}

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
    const [selectedDay, setSelectedDay] = useState(0);
    const [pickupTime, setPickupTime] = useState('');
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

    const isWithinOrderingHours = getPickupTimeSlots(selectedDay).length > 0;

    useEffect(() => {
        if (!hasHydrated) return;

        async function initClover() {
            const cardNumberEl = document.getElementById('card-number');
            if (!cardNumberEl) return;
            if (cardNumberEl.children.length > 0) return;
            cloverRef.current = null;

            const data = await getApiKey();

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
    }, [hasHydrated, selectedDay]);

    async function handlePay() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;    

        if (!emailRegex.test(customerInfo.email)) {
            setError('Please enter a valid email address!');
            return;
        }

        if (!phoneRegex.test(customerInfo.phoneNumber)) {
            setError('Please enter a valid phone number!');
            return;
        }

        if (!cloverRef.current) return;
        setIsLoading(true);
        setError('');
        try {
            const { token } = await cloverRef.current.createToken();
            if (!token) throw new Error('Error! Missing Details');


            const slots = getPickupTimeSlots(selectedDay);
            const dayLabel = getDayOptions()[selectedDay].label;
            const timeValue = pickupTime || slots[0]?.value || '';
            const [h, m] = timeValue.split(':').map(Number);
            const t = new Date(); t.setHours(h, m);
            const timeLabel = t.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const order = await createOrder(items, `${dayLabel} at ${timeLabel}`);
            if (!order?.id) throw new Error('Failed to create order. Please try again.');
            let customer;
            try {
                customer = await createCustomer(customerInfo);
            } catch (e) {
                await deleteOrder(order.id);
                setError(e instanceof Error ? e.message : 'Something went wrong.');
                return;
            }
            try {
                await linkCustomerToOrder(order.id, customer.id);
                await pay({ orderId: order.id, source: token, amount: order.total, tipAmount });
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    items,
                    total,
                    tipAmount,
                    pickupNote: `${dayLabel} at ${timeLabel}`,
                    customerName: customerInfo.firstName,
                }));
                const html = buildOrderEmailHtml({
                    firstName: customerInfo.firstName,
                    items,
                    total,
                    tipAmount,
                    grossTotal,
                    pickupNote: `${dayLabel} at ${timeLabel}`,
                });
                await sendEmail({recipent: customerInfo.email, subject:'Order Confirmation', html});
                clearCart();
                router.push('/order/confirmed');
            } catch (error) {
                await deleteOrder(order.id); 
                await deleteCustomer(customer.id);
                setError('Payment Failed. Please Try Again.')
            }
            
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong with the payment');
        } finally {
            setIsLoading(false);
        }
    }

    if (!hasHydrated) return null;

    return (
        <div className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-16">

                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Checkout</h1>
                {!isWithinOrderingHours && (
                    <div className="mb-8 px-4 py-3 bg-yellow-50 border border-yellow-200 w-fit rounded-lg text-sm text-yellow-800">
                        We're not accepting anymore online orders for today. Our ordering hours are 12:00 PM - 5:00 PM.
                    </div>
                )}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

                    <div className="flex-1 flex flex-col gap-6">

                        <CustomerInfoForm value={customerInfo} onChange={handleCustomerChange} />

                        <hr className="border-gray-200" />

                        <PickupTimeSelector
                            dayOptions={getDayOptions()}
                            timeSlots={getPickupTimeSlots(selectedDay)}
                            selectedDay={selectedDay}
                            pickupTime={pickupTime}
                            onDayChange={(offset) => { setSelectedDay(offset); setPickupTime(''); }}
                            onTimeChange={setPickupTime}
                        />

                        <hr className="border-gray-200" />

                        <TipSelector
                            total={total}
                            tipPercent={tipPercent}
                            customTip={customTip}
                            onPercentSelect={(pct) => { setTipPercent(tipPercent === pct ? 0 : pct); setCustomTip(''); }}
                            onCustomTipChange={(val) => { setCustomTip(val); setTipPercent(0); }}
                        />

                        <hr className="border-gray-200" />         
                            {/* Card Details */}
                            {isWithinOrderingHours && (
                            <section>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Card Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className={inputCls}>
                                        <div id="card-number" className="h-full"/>
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
                            )}
                    </div>

                    {/* Order summary */}
                    <div className="w-full lg:w-96 lg:sticky lg:top-8">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

                            <div className="p-6 flex flex-col gap-3">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order summary</h2>
                                <div className="flex flex-col gap-2.5 mt-1">
                                    {items.map((item) => {
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
                                        const note = item.note?.split('\n').find(line => line.startsWith('\x1F'))?.slice(1);
                                        return (
                                            <div key={item.cartItemId} className="flex justify-between gap-4 text-sm">
                                                <div className="text-gray-600">
                                                    <span><span className="font-medium text-gray-900">{item.quantity}×</span> {item.name}</span>
                                                    {modifierLabels.length > 0 && (
                                                        <p className="text-xs text-gray-400 mt-0.5">{modifierLabels.join(', ')}</p>
                                                    )}
                                                    {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
                                                </div>
                                                <span className="font-medium text-gray-900 shrink-0">${(item.totalPrice / 100).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
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
                                    disabled={isLoading || items.length === 0 || !isWithinOrderingHours}
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
