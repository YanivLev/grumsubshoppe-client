'use client'

import { useRef } from 'react'
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import ModifierChip from "@/app/components/molecules/ModifierChip";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

interface ModifierGroupProps {
    group: IModifierGroup;
    selectedIds: string[];
    defaultIds: string[];
    onToggle: (id: string) => void;
    extraIds: string[];
    onExtra: (id: string) => void;
    lightIds: string[];
    onLight: (id: string) => void;
}

export default function ModifierGroup({group, selectedIds, defaultIds, onToggle, extraIds, onExtra, lightIds, onLight}: ModifierGroupProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scrollLeft() {
        scrollRef.current?.scrollBy({ left: -96, behavior: 'smooth' });
    }

    function scrollRight() {
        scrollRef.current?.scrollBy({ left: 96, behavior: 'smooth' });
    }

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{group.name.split(" ")[0]}</h3>
        <div className="relative flex items-center gap-2 w-full">

            {/* Left Arrow */}
            <button
                onClick={scrollLeft}
                className="pb-3"
            >
                <ArrowCircleLeftIcon fontSize={"large"} color={"action"} className="rounded-full cursor-pointer hover:bg-gray-200 " />
            </button>

            {/* Scrollable Row */}
            <div ref={scrollRef} className="flex gap-2 lg:gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory min-w-0 flex-1 max-w-[272px] lg:max-w-[368px]" style={{ scrollbarWidth: 'none' }}>
                {group.modifiers?.elements?.map((item) => (
                    <ModifierChip
                        key={item.id}
                        label={item.name}
                        selected={selectedIds.includes(item.id)}
                        isDefault={defaultIds.includes(item.id)}
                        onToggle={() => onToggle(item.id)}
                        isExtra={extraIds.includes(item.id)}
                        onExtra={() => onExtra(item.id)}
                        isLight={lightIds.includes(item.id)}
                        onLight={() => onLight(item.id)}
                    />
                ))}
            </div>

            {/* Right Arrow */}
            <button
                onClick={scrollRight}
                className="pb-3"
            >
                <ArrowCircleRightIcon fontSize={"large"} color={"action"} className="rounded-full cursor-pointer hover:bg-gray-200"/>
            </button>
            </div>
    </div>
    )
}
