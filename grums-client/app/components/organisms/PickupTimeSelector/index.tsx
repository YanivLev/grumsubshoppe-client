'use client';

import DayButton from '@/app/components/molecules/DayButton';

const fieldCls = 'block w-full px-3 h-10 border border-gray-300 rounded-md text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-black focus:border-black transition-shadow placeholder:text-gray-400';

interface DayOption { offset: number; label: string; }
interface TimeSlot { value: string; label: string; }

interface PickupTimeSelectorProps {
  dayOptions: DayOption[];
  timeSlots: TimeSlot[];
  selectedDay: number;
  pickupTime: string;
  onDayChange: (offset: number) => void;
  onTimeChange: (value: string) => void;
}

export default function PickupTimeSelector({
  dayOptions, timeSlots, selectedDay, pickupTime, onDayChange, onTimeChange,
}: PickupTimeSelectorProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Pickup Time</h2>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-2">
          {dayOptions.map(({ offset, label }) => (
            <DayButton
              key={offset}
              label={label}
              selected={selectedDay === offset}
              onSelect={() => onDayChange(offset)}
            />
          ))}
        </div>
        <select
          value={pickupTime || timeSlots[0]?.value}
          onChange={(e) => onTimeChange(e.target.value)}
          className={fieldCls}
        >
          {timeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>{slot.label}</option>
          ))}
        </select>
      </div>
    </section>
  );
}