'use client'

import { useRef } from 'react'
import { IModifierGroup } from "@/app/common/interfaces/modifier.interface";
import ModifierChip from "@/app/components/molecules/ModifierChip";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RequiredLabel from "@/app/components/atoms/RequiredLabel";

interface ModifierGroupProps {
    group: IModifierGroup;
    selectedIds: string[];
    defaultIds: string[];
    onToggle: (id: string) => void;
    extraIds: string[];
    onExtra: (id: string) => void;
    lightIds: string[];
    onLight: (id: string) => void;
    hasError?: boolean;
    isSizeGroup?: boolean;
}

export default function ModifierGroup({ group, selectedIds, defaultIds, onToggle, extraIds, onExtra, lightIds, onLight, hasError, isSizeGroup }: ModifierGroupProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scrollLeft() {
        scrollRef.current?.scrollBy({ left: -96, behavior: 'smooth' });
    }

    function scrollRight() {
        scrollRef.current?.scrollBy({ left: 96, behavior: 'smooth' });
    }

    return (
        <div className={`mb-8 rounded-xl p-3 transition-all duration-700 ${hasError ? 'ring-2 ring-red-500' : 'ring-0 ring-transparent'}`}>
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">{group.name.split(" ")[0]}</h3>
                    {group.name == "Half/Whole" && <RequiredLabel />}
            </div>

            {isSizeGroup ? (
                <div className="flex flex-col gap-3">
                    {group.modifiers?.elements?.map((mod) => {
                        const isSelected = selectedIds.includes(mod.id);
                        return (
                            <button
                                key={mod.id}
                                onClick={() => onToggle(mod.id)}
                                className={`w-full flex items-center justify-between px-6 py-3 rounded-full border-2 transition-all duration-200 ${
                                    isSelected ? 'border-green-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <span className={`text-lg ${isSelected ? 'text-black' : 'text-gray-700'}`}>{mod.name}</span>
                                {isSelected
                                    ? <CheckCircleIcon className="text-green-600" />
                                    : <div className="w-6 h-6 rounded-full bg-gray-200" />}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="relative flex items-center gap-2 w-full">
                    <button onClick={scrollLeft} className="pb-3">
                        <ArrowCircleLeftIcon fontSize="large" color="action" className="rounded-full cursor-pointer hover:bg-gray-200" />
                    </button>
                    <div ref={scrollRef} className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory min-w-0 flex-1 max-w-[272px] lg:max-w-[368px]" style={{ scrollbarWidth: 'none' }}>
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
                    <button onClick={scrollRight} className="pb-3">
                        <ArrowCircleRightIcon fontSize="large" color="action" className="rounded-full cursor-pointer hover:bg-gray-200" />
                    </button>
                </div>
            )}
        </div>
    );
}
