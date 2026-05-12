'use client'

interface DayButtonProps {
    label: string;
    selected: boolean;
    onSelect: () => void;
}
  
export default function DayButton({ label, selected, onSelect }: DayButtonProps) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
          selected
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        {label}
      </button>
    );
}