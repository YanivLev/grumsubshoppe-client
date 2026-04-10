'use client'

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/app/store/cart.store';
import { getApiKey } from '@/app/actions/payment/get-api-key';
import { createOrder } from '@/app/actions/order/create-order';
import { pay } from '@/app/actions/payment/pay';
import { useRouter } from 'next/navigation';
import { ICloverSDK } from '@/app/common/interfaces/clover-sdk.interface';

declare global {
    interface Window {
      Clover: new (apiAccessKey: string) => ICloverSDK;
    }
  }

const TIP_OPTIONS = [10, 15, 18, 20];

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

    
    const tipAmount = tipPercent > 0
        ? Math.round(total * tipPercent / 100)
        : customTip ? Math.round(parseFloat(customTip) * 100) : 0;

    const grossTotal = total + tipAmount;

;

    useEffect(() => {
        if (cloverRef.current) return;
        async function initClover() {
            const data = await getApiKey();
            const existingScript = document.querySelector(`script[src="${process.env.NEXT_PUBLIC_CLOVER_CHECKOUT_URL}"]`);
            const cardContainer = document.getElementById('card-element');
            if (!cardContainer || cardContainer.children.length > 0) return;

            if (existingScript) {
                const clover = new window.Clover(data.apiAccessKey);
                cloverRef.current = clover;
                const elements = clover.elements();
                const card = elements.create('CARD');
                card.mount('#card-element');
                return;
            }
            const script = document.createElement('script');
            script.src = process.env.NEXT_PUBLIC_CLOVER_CHECKOUT_URL!;
            script.onload = () => {
                const cardEl = document.getElementById('card-element');
                if (!cardEl || cardEl.children.length > 0) return;
                const clover = new window.Clover(data.apiAccessKey);
                cloverRef.current = clover;
                const elements = clover.elements();
                const card = elements.create('CARD');
                card.mount('#card-element');
            };
            document.head.appendChild(script);
        }
        initClover();
    }, []);

    async function handlePay() {
        const order = await createOrder(items);
        console.log('Order total from Clover:', order.total, 'Paying amount:', total, 'tip:', tipAmount);

        if (!cloverRef.current) return;
        setIsLoading(true);
        setError('');
        try {
            const { token } = await cloverRef.current.createToken();
            if (!token ) throw new Error('Card tokenization failed');
            const order = await createOrder(items);
            await pay({ orderId: order.id, source: token, amount: total, tipAmount });
            clearCart();
            router.push('/order/confirmation');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message: 'Something went wrong with the payment');
        } finally {
            setIsLoading(false);
        }
    }

    if (!hasHydrated) return null;

    console.log('items:', items, 'total:', total);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
          <div className="w-full max-w-lg flex flex-col gap-6">
    
            <h1 className="text-3xl font-bold">Checkout</h1>
    
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              {items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.totalPrice / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
    
            {/* Tip */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Add a Tip</h2>
              <div className="flex gap-2">
                {TIP_OPTIONS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => { setTipPercent(pct); setCustomTip(''); }}
                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                      tipPercent === pct ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom tip ($)"
                value={customTip}
                onChange={(e) => { setCustomTip(e.target.value); setTipPercent(0); }}
                className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
              />
              {tipAmount > 0 && (
                <p className="text-sm text-gray-500">Tip: ${(tipAmount / 100).toFixed(2)}</p>
              )}
            </div>
    
            {/* Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-semibold text-lg">Payment</h2>
              <div id="card-element" className="min-h-[50px] bg-gray-50" />
            </div>
    
            {error && <p className="text-red-500 text-sm">{error}</p>}
    
            <div className="flex justify-between items-center px-1">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold">${(grossTotal / 100).toFixed(2)}</span>
            </div>
    
            <button
              onClick={handlePay}
              disabled={isLoading || items.length === 0}
              className="w-full bg-black text-white py-4 rounded-full font-bold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isLoading ? 'Processing...' : `Pay $${(grossTotal / 100).toFixed(2)}`}
            </button>
    
          </div>
        </div>
      );
}