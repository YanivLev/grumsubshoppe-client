'use client'

interface TipOptionProps {
    percent: number;
    dollarAmount: number;
    selected: boolean;
    onSelect: () => void;
  }
  
  export default function TipOption({ percent, dollarAmount, selected, onSelect }: TipOptionProps) {
    return (
      <button
        onClick={onSelect}
        className={`flex flex-col items-center py-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
          selected
            ? 'border-gray-900 bg-green-700 text-white'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        <span>{percent}%</span>
        <span className={`text-xs mt-0.5 font-normal ${selected ? 'text-white' : 'text-gray-400'}`}>
          ${dollarAmount.toFixed(2)}
        </span>
      </button>
    );
  }