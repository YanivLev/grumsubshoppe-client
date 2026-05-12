'use client';

import { ICartItem } from '@/app/store/cart.store';

interface OrderSummaryPanelProps {
  items: ICartItem[];
  total: number;
  tipAmount: number;
  tipPercent: number;
  grossTotal: number;
  error: string | null;
  isLoading: boolean;
  isWithinOrderingHours: boolean;
  onPay: () => void;
}

export default function OrderSummaryPanel({
  items, total, tipAmount, tipPercent, grossTotal,
  error, isLoading, isWithinOrderingHours, onPay,
}: OrderSummaryPanelProps) {
  return (
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
            onClick={onPay}
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
  );
}
