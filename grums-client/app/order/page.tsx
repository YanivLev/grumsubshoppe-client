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
import CardDetailsForm from '../components/organisms/CardDetailsInput';
import OrderSummaryPanel from '../components/organisms/OrderSummaryPanel';

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
                        {isWithinOrderingHours && <CardDetailsForm />}
                    </div>

                    <OrderSummaryPanel
                        items={items}
                        total={total}
                        tipAmount={tipAmount}
                        tipPercent={tipPercent}
                        grossTotal={grossTotal}
                        error={error}
                        isLoading={isLoading}
                        isWithinOrderingHours={isWithinOrderingHours}
                        onPay={handlePay}
                    />


                </div>
            </div>
        </div>
    );
}
