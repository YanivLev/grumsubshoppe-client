"use client"

import {useEffect, useRef } from "react";
import IconButton from "@/app/components/atoms/IconButton";


interface SearchBarProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default function SearchBar({isOpen, onOpen, onClose}: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if(isOpen) {
            const t = setTimeout(() => inputRef.current?.focus(), 50);
            return() => clearTimeout(t);
        }
    }, [isOpen]);

    return (
        <>
        {!isOpen && (
            <IconButton
                ariaLabel="Open search"
                onClick={onOpen}
                className="shrink-0 rounded-full border border-gray-300 hover:bg-gray-50"
            >
                <i className="bx bx-search text-[20px]" />
            </IconButton>
        )}
        
        <div
            className={`relative overflow-hidden transition-[width,opacity] duration-200 ${
                isOpen ? "w-[20rem] max-w-[30vw] opacity-100" : "w-0 opacity-0"
            }`}
            style={{zIndex: 6}}
        >    
            <div className="relative">
                <i
                    className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-500"
                    aria-hidden="true">
                </i>
                <input 
                    ref={inputRef}
                    type="text"
                    placeholder="Search menu, items, nutrition..."
                    className="w-full h-12 rounded-half border border-gray-300 bg-white pl-10 pr-12 shadow-sm focus:ring focus:ring-green-200"
                />
                <button
                    aria-label="Close search"
                    onClick={onClose}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                >
                    <i className="bx bx-x text-2xl" />
                </button>
            </div>
        </div>
    </>    
    );
}