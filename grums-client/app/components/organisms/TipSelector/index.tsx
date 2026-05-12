'use client';

import TipOption from '@/app/components/molecules/TipOption';

const TIP_OPTIONS = [10, 15, 18, 20];
const MAX_TIP = 999;

interface TipSelectorProps {
  total: number;
  tipPercent: number;
  customTip: string;
  onPercentSelect: (pct: number) => void;
  onCustomTipChange: (value: string) => void;
}

export default function TipSelector({
  total, tipPercent, customTip, onPercentSelect, onCustomTipChange,
}: TipSelectorProps) {
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const digits = val.replace('.', '').replace('-', '');
    if (digits.length > 4) return;
    const num = parseFloat(val);
    if (!isNaN(num) && (num < 0 || num > MAX_TIP)) return;
    onCustomTipChange(val);
  };

  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tip</h2>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {TIP_OPTIONS.map((pct) => (
          <TipOption
            key={pct}
            percent={pct}
            dollarAmount={Math.round(total * pct / 100) / 100}
            selected={tipPercent === pct}
            onSelect={() => onPercentSelect(pct)}
          />
        ))}
      </div>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">$</span>
        <input
          type="number"
          placeholder="Custom amount"
          value={customTip}
          onChange={handleCustomChange}
          className="w-full h-12 pl-8 pr-4 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white outline-none focus:ring-1 focus:ring-black focus:border-black transition-shadow placeholder:text-gray-400"
        />
      </div>
    </section>
  );
}