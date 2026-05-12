'use client';

const inputCls = 'border border-gray-300 rounded-md h-10 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-black focus-within:border-black transition-shadow';

export default function CardDetailsForm() {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Card Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={inputCls}><div id="card-number" className="h-full" /></div>
        <div className={inputCls}><div id="card-name" className="h-full" /></div>
        <div className={inputCls}><div id="card-date" className="h-full" /></div>
        <div className={inputCls}><div id="card-cvv" className="h-full" /></div>
        <div className={inputCls}><div id="card-zip" className="h-full" /></div>
        <div className={inputCls}><div id="card-street-address" className="h-full" /></div>
      </div>
      <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Your payment info is encrypted and never stored on our servers.
      </p>
    </section>
  );
}