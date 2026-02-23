'use client'

import { useRef } from 'react'
import { IModifierGroup } from "./interfaces/modifier.interface";
import ModifierChip from "./modifier-chip"

interface ModifierGroupProps {
    group: IModifierGroup;
    selectedIds: string[];
    defaultIds: string[];
    onToggle: (id: string) => void;
}

export default function ModifierGroup({group, selectedIds, defaultIds, onToggle}:ModifierGroupProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scrollLeft() {
        scrollRef.current?.scrollBy({ left: -96, behavior: 'smooth' });
    }

    function scrollRight() {
        scrollRef.current?.scrollBy({ left: 96, behavior: 'smooth' });
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
        <div className="relative flex items-center w-full">
    
            {/* Left Arrow */}
            <button 
                onClick={scrollLeft}
                className="z-10 p-2 bg-white shadow-md border rounded-full hover:bg-gray-100 cursor-pointer"
            >
                ‹
            </button>

            {/* Scrollable Row */}
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 min-w-0 flex-1 max-w-[384px]" style={{ scrollbarWidth: 'none' }}>
                {group.modifiers?.elements?.map((item) => (
                    <ModifierChip 
                        key={item.id}
                        label={item.name}
                        selected={selectedIds.includes(item.id)}
                        isDefault={defaultIds.includes(item.id)}
                        onToggle={() => onToggle(item.id)}
                    />
                ))}
            </div>

            {/* Right Arrow */}
            <button 
                onClick={scrollRight}
                className="z-10 p-2 bg-white shadow-md border rounded-full hover:bg-gray-100 cursor-pointer"
            >
                ›
            </button>
            </div>
    </div>
    )
}


