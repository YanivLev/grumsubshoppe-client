"use client"

import Link from "next/link";
import { useRef } from "react";
import NavLink from "@/app/components/atoms/NavLink";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <div
          className={`lg:hidden fixed inset-x-0 top-20 z-30 origin-top bg-white transition-all duration-200 ${
            isOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
          } border-t border-gray-200 shadow-lg`}
        >
          <div className="px-4 pb-6 pt-4 space-y-4">
            <div className="relative">
              <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Try: Nutrition and allergens"
                className="w-full h-12 rounded-full border border-gray-300 text-black bg-white pl-10 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-100"
              />
              <button
                onClick={() => { if (inputRef.current) inputRef.current.value = ""; }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className="bx bx-x text-2xl" />
              </button>
            </div>
    
            <nav className="grid gap-4 text-2xl font-medium text-black">
              <NavLink href="/menu" onClick={onClose} className="text-2xl">
                Menu <i className="bx bx-chevron-right text-xl" />
              </NavLink>
              <NavLink href="/locations" onClick={onClose} className="text-2xl">
                Find Us <i className="bx bx-map-pin text-xl" />
              </NavLink>
            </nav>
    
            <div className="pt-2 grid gap-3">
              <Link
                href="/order"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full px-6 h-11 font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 shadow"
              >
                Order now
              </Link>
            </div>
          </div>
        </div>
      );
    }