"use client";

import Image from "next/image";
import Link from 'next/link';
import IconButton from "@/app/components/atoms/IconButton";
import { useEffect, useRef, useState } from "react";
import logo from "../icons/GrumsLogo.svg";
import { Open_Sans,Montserrat ,Roboto, Roboto_Slab, IBM_Plex_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"], // pick weights you want
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-IBM-Plex-Sans",
  weight: ["400", "500", "600", "700"], // pick weights you
});

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-mdx">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">

          {/* ===== DESKTOP / LAPTOP ===== */}
          <div className="hidden tablet:grid grid-cols-[1fr_auto_1fr] items-center h-28">

            {/* LEFT: Find Us */}
            <div className="h-fit flex items-center">
              <button
                onClick={() => window.open('https://maps.app.goo.gl/qeSogw7jGB7Jp6QV7')}
                className={`flex cursor-pointer items-center text-lg tracking-[-0.01em] ${ibmPlex.className} font-medium hover:text-green-800 transition-all`}
              >
                 <i className="text-green-900 bx bx-map text-2xl" aria-hidden="true" />
                <div className="text-green-900 relative hover:underline ">
                  Find Us
                </div>
              </button>
              <div className="flex items-center gap-8 pl-4">
                <div className="h-8 border-l border-gray-400"></div>
                  <Link
                  href="/menu"
                  className={`text-black hover:text-green-900 hover:underline hover:font-semibold text-lg tracking-[-0.02em] ${ibmPlex.className} font-regular`}
                  >
                  Menu
                  </Link>
                  <Link
                  href="/about"
                  className={`text-black hover:text-green-900 hover:underline hover:font-semibold text-lg tracking-[-0.02em] ${ibmPlex.className} font-regular`}
                  >
                  About
                  </Link>
              </div>
            </div>

            {/* CENTER: Single logo circle overlapping the seam */}
            <div className="relative grid place-items-center ">
              <Link href="/" aria-label="Go home">
                <img src={logo.src} alt="" className="h-25 w-34 hover:scale-105 transition-all "/>
              </Link>
            </div>

            {/* RIGHT: search + order (no overlap) */}
            <div className="relative flex items-center justify-end gap-4 min-w-0">
             {/* search toggle icon (only shows when search is closed) */}
              {!searchOpen && (
                <IconButton
                  ariaLabel="Open search"
                  onClick={() => setSearchOpen(true)}
                  className="shrink-0 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  <i className="bx bx-search text-[20px]" />
                </IconButton>
              )}

              {/* expanding search pill */}
              <div
                className={`relative overflow-hidden transition-[width,opacity] duration-200 ${
                  searchOpen ? "w-[20rem] max-w-[30vw] opacity-100" : "w-0 opacity-0"
                }`}
                style={{ zIndex: 6 }}
              >
                <div className="relative">
                  <i
                    className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-500"
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search menu, items, nutrition…"
                    className="w-full h-12 rounded-half border border-gray-300 bg-white pl-10 pr-12 shadow-sm focus:ring focus:ring-green-200"
                  />
                  {/* X inside the input on the right */}
                  <button
                    aria-label={searchOpen ? "Close search" : "Open search"}
                    onClick={() => setSearchOpen(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  >
                    <i className="bx bx-x text-2xl" />
                  </button>
                </div>
              </div>

              <Link
                href="/order"
                className="border-3 broder-green-600 shrink-0 inline-flex items-center justify-center rounded-full px-6 h-10 font-semibold  text-white bg-gradient-to-t from-green-700 to-green-500 hover:from-green-700 transition-all hover:to-green-800 shadow focus:outline-offset-2 focus:outline-green-500"
              >
                Order Now
              </Link>
            </div>
          </div>

          {/* ===== MOBILE / TABLET ===== */}
          <div className="tablet:hidden grid grid-cols-3 items-center h-20">
            <IconButton
              ariaLabel={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(v => !v)}
              className="rounded-md"
            >
              <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"} text-black text-3xl`} />
            </IconButton>
          
       
            <div className="grid place-items-center">
              <Link href="/" aria-label="Go Home">
                <Image
                  src={logo}
                  alt="Grum's Home"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT: Order Now stacked text */}
            {/* RIGHT: Order / Now + Call (mobile only) */}
            <div className="justify-self-end flex items-center gap-5 pr-2">
              {/* stacked Order / Now, centered together */}
              {/* Call button (phone icon) */}
          
              <IconButton
                ariaLabel="Call Grum's"
                onClick={() => window.open('tel:+12163214781')}
                className="rounded-full border border-gray-500 hover:bg-green-50 active:scale-95 transition"
              >
                <i className="bx bx-phone-call text-green-700 text-2xl" aria-hidden="true" />
              </IconButton>  

              <div className="flex flex-col items-center leading-[1]">
                <Link href="/order" className="block m-0 p-0 text-green-700 font-semibold text-base">Order</Link>
                <Link href="/order" className="block m-0 p-0 -mt-0.5 text-green-700 font-semibold text-base">Now</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE/TABLET DRAWER ===== */}
      <div
        className={`tablet:hidden fixed inset-x-0 top-20 z-30 origin-top bg-white transition-all duration-200 ${
          menuOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        } border-t border-gray-200 shadow-lg`}
      >
        <div className="px-4 pb-6 pt-4 space-y-4">
          <div className="relative">
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Try: Nutrition and allergens"
              className="w-full h-12 rounded-full border border-gray-300 text-black bg-white pl-10 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-100"
            />
            <button
              onClick={() => { if (searchInputRef.current!=null) searchInputRef.current.value = ""; }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i className="bx bx-x text-2xl" />
            </button>
          </div>

          <nav className="grid gap-4 text-2xl font-medium text-black">
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              Menu <i className="bx bx-chevron-right text-xl" />
            </Link>
            <Link href="/locations" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              Find Us
              <i className="bx bx-map-pin text-xl" />
            </Link>
          </nav>

          <div className="pt-2 grid gap-3">
            <Link
              href="/order"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full px-6 h-11 font-semibold text-white bg-gradient-to-r from-green-600 to-green-500 shadow"
            >
              Order now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}