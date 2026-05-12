'use client'

const MAX_CHAR_LENGTH = 150;

interface SpecialInstructionsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SpecialInstructionsInput({ value, onChange }: SpecialInstructionsInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (input.length <= MAX_CHAR_LENGTH) onChange(input);
  };

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex justify-between items-center px-1">
        <label
          htmlFor="item-notes"
          className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
        >
          Special Instructions
        </label>
        <span className={`text-xs font-medium ${value.length >= MAX_CHAR_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
          {value.length} / {MAX_CHAR_LENGTH}
        </span>
      </div>
      <textarea
        id="item-notes"
        rows={3}
        placeholder="Add a note (e.g. label the sub, cut differently)"
        value={value}
        onChange={handleChange}
        className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
      />
    </div>
  );
}