"use client";

import Link from 'next/link';
import IconButton from "@/app/components/atoms/IconButton";
import GrumsLogo from "@/app/components/atoms/GrumsLogo";
import NavLink from "@/app/components/atoms/NavLink";
import MobileDrawer from "./mobile-drawer"
import SearchBar from "./search-bar"
import { useState } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import CartIcon from '@/app/components/atoms/CartIcon';

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-IBM-Plex-Sans",
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
                  <NavLink href="/menu">Menu</NavLink>
                  <NavLink href="/about">About</NavLink>
              </div>
            </div>

            {/* CENTER: Single logo circle overlapping the seam */}
            <div className="relative grid place-items-center ">
              <Link href="/" aria-label="Go home">
                <GrumsLogo size="lg"/>
              </Link>
            </div>

            {/* RIGHT: search + order (no overlap) */}
            <div className="relative flex items-center justify-end gap-4 min-w-0">
              <SearchBar
                isOpen={searchOpen}
                onOpen={() => setSearchOpen(true)}
                onClose={() => setSearchOpen(false)}
              />
              <CartIcon />
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
                <GrumsLogo/>
              </Link>
            </div>

            {/* Call (mobile only) */}
            <div className="justify-self-end flex items-center gap-3 pr-2">
              
              <IconButton
                ariaLabel="Call Grum's"
                onClick={() => window.open('tel:+12163214781')}
                className="rounded-full border border-gray-500 hover:bg-green-50 active:scale-95 transition"
              >
                <i className="bx bx-phone-call text-green-700 text-2xl" aria-hidden="true" />
              </IconButton>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer 
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}