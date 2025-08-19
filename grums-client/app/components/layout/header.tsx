// "use client";

// import logo from "../icons/GrumsLogo.svg";
// import { useState } from "react";

// function Header() {
//   const [isFocused, setIsFocused] = useState(false);
//   return (
//     <div className="w-full h-full absolute
//     bg-gradient-to-r from-blue-400 to-emerald-400">
//       <header className=" grid grid-cols-[1fr_auto_1fr] items-center
//           text-black py-2 px-8 md:px-32 bg-white drop-shadow-md"> 
     
//         <div className="min-w-0">
//           <ul className="hidden xl:flex items-center
//           gap- font-semibold text-base">
//             <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer hover:scale-115 transition-all">Homes</li>
//             <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer hover:scale-115 transition-all">About</li>
//             <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer hover:scale-115 transition-all">Contact</li>
//             <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer hover:scale-115 transition-all">Explore</li>
//           </ul>
//         </div>

//         <div className="justify-self-center">
//           <a href="#">
//             <img src={logo.src} alt="" className="h-25 w-52 hover:scale-105 transition-all "/>
//           </a>
//         </div>
//         {/* <div className="relative hidden md:flex
//         items-center justify-center gap-3">
//           <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
//           <input type="text" placeholder="Search" className="py-2 pl-10 rounded-xl border-2
//           border-blue-300 focus:bg-slate-100 focus:outline-sky-500 "/>
//         </div> */}
//        <div className="justify-self-end min-w-0">
//           <div className="relative hidden md:flex items-center">
//             <i className="bx bx-search absolute left-3 text-2xl text-gray-500 pointer-events-none"></i>
//             <input
//               type="text"
//               placeholder="Search"
//               onFocus={() => setIsFocused(true)}
//               onBlur={() => setIsFocused(false)}
//               className={`
//                 w-40 ${isFocused ? "md:w-64" : "md:w-40"}
//                 transition-all duration-300
//                 py-2 pl-10 rounded-xl border-2 border-blue-300
//                 focus:bg-slate-100 focus:outline-sky-500
//               `}
//             />
//           </div>
//         </div>
//         <div className="justify-self-end min-w-0 relative hidden md:flex items-center">
//           <i className="bx bx-menu xl:hidden "/>
//         </div>
//       </header>
//     </div>
//   );
// }
// export default Header;

// ***********************************************************************************************
// "use client";

// import logo from "../icons/GrumsLogo.svg";
// import { useState } from "react";

// function Header() {
//   const [isFocused, setIsFocused] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <div className="w-full bg-gradient-to-r from-blue-400 to-emerald-400">
//       <header className="bg-white drop-shadow-md text-black">

//         {/* MOBILE/TABLET BAR (logo left, hamburger right) */}
//         <div className="flex lg:hidden items-center justify-between px-4 py-2 ">
//           <a href="#" className="shrink-1">
//             <img src={logo.src} alt="Grum's Subshoppe" className="h-20 w-auto " />
//           </a>
//           <button
//             aria-label="Toggle menu"
//             onClick={() => setMobileOpen((s) => !s)}
//             className="p-2 rounded-lg  border content-end border-blue-300 active:scale-95"
//           >
//             <i className={`bx ${mobileOpen ? "bx-x" : "bx-menu"} text-4xl`} />
//           </button>
//         </div>

//         {/* MOBILE MENU PANEL */}
//         <div
//           className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${
//             mobileOpen ? "max-h-96" : "max-h-0"
//           }`}
//         >
//           <nav className="px-4 pb-4">
//             <ul className="flex flex-col gap-2 font-semibold">
//               <li className="p-3 rounded-md hover:bg-sky-100 active:bg-sky-200">Home</li>
//               <li className="p-3 rounded-md hover:bg-sky-100 active:bg-sky-200">About</li>
//               <li className="p-3 rounded-md hover:bg-sky-100 active:bg-sky-200">Contact</li>
//               <li className="p-3 rounded-md hover:bg-sky-100 active:bg-sky-200">Explore</li>
//               {/* Optional mobile search */}
//               <li className="mt-2">
//                 <div className="relative">
//                   <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-500 pointer-events-none" />
//                   <input
//                     type="text"
//                     placeholder="Search"
//                     className="w-full py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500"
//                   />
//                 </div>
//               </li>
//             </ul>
//           </nav>
//         </div>

//         {/* DESKTOP BAR (lg+): grid with logo centered */}
//         <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-10 lg:px-16 py-2">
//           {/* LEFT — (optional) nav (only show at xl+) */}
//           <nav className="hidden xl:flex justify-start">
//             <ul className="flex items-center gap-10 font-semibold text-bas">
//               <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition hover:scale-110 cursor-pointer">Home</li>
//               <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition hover:scale-110 cursor-pointer">About</li>
//               <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition hover:scale-110 cursor-pointer">Contact</li>
//               <li className="p-3 hover:bg-sky-400 hover:text-white rounded-md transition hover:scale-110 cursor-pointer">Explore</li>
//             </ul>
//           </nav>

//           {/* CENTER — logo (truly centered on desktop) */}
//           <a href="#" className="justify-self-center shrink-0 ">
//             <img src={logo.src} alt="Grum's Subshoppe" className="h-22 w-auto hover:scale-105 transition" />
//           </a>

//           {/* RIGHT — search (reserved width so it won’t push layout) */}
//           <div className="justify-self-end min-w-0">
//             <div className="relative hidden lg:flex items-center w-[14rem] xl:w-[18rem]">
//               <i className="bx bx-search absolute left-3 text-2xl text-gray-500 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//                 className={[
//                   // collapsed width
//                   "w-[10rem] xl:w-[12rem]",
//                   // expand on focus within reserved wrapper
//                   isFocused ? "lg:w-[14rem] xl:w-[18rem]" : "",
//                   // visuals
//                   "transition-all duration-300 py-2 pl-10 rounded-xl border-2 border-blue-300",
//                   "focus:bg-slate-100 focus:outline-sky-500",
//                 ].join(" ")}
//               />
//             </div>
//           </div>
//         </div>
//       </header>
//     </div>
//   );
// }

// export default Header;

// ***********************************************************************************************

"use client";

import Image from "next/image";
import Link from "next/link";
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

export default function Header() {
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm outline-2 outline-dashed outline-gray-400/50">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">

          {/* ===== DESKTOP / LAPTOP ===== */}
          <div className="hidden tablet:grid grid-cols-[1fr_auto_1fr] items-center h-28">

            {/* LEFT: Find Us */}
            <div className="h-fit flex items-center">
              <Link
                href="https://maps.app.goo.gl/qeSogw7jGB7Jp6QV7"
                className={`flex items-center text-lg tracking-[-0.02em] ${openSans.className} font-medium hover:text-green-800 transition-all`}
              >
                 <i className="bx bx-map text-2xl" aria-hidden="true" />
                Find Us
              </Link>
              <div className="flex items-center gap-8 pl-4">
                <div className="h-8 border-l border-gray-400"></div>
                  <Link
                  href="/menu"
                  className={` hover:text-green-800 text-lg tracking-[-0.02em] ${openSans.className} font-semibold`}
                  >
                  Menu
                  </Link>
                  <Link
                  href="/about"
                  className={` hover:text-green-800 text-lg tracking-[-0.02em] ${openSans.className} font-semibold`}
                  >
                  About
                  </Link>
              </div>
            </div>

            {/* CENTER: Single logo circle overlapping the seam */}
            <div className="relative grid place-items-center ">
            <a href="/" aria-label="Go home">
              <img src={logo.src} alt="" className="h-25 w-34 hover:scale-105 transition-all "/>
            </a>
            </div>

            {/* RIGHT: search + order (no overlap) */}
            <div className="relative flex items-center justify-end gap-4 min-w-0">
             {/* search toggle icon (only shows when search is closed) */}
              {!searchOpen && (
                <button
                  aria-label="Open search"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                >
                  <i className="bx bx-search text-[20px]" />
                </button>
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
                className="border-3 broder-green-600 shrink-0 inline-flex items-center justify-center rounded-full px-6 h-10 font-semibold  text-white bg-gradient-to-t from-green-700 to-green-500 hover:from-green-700 transition-all hover:to-green-800 shadow "
              >
                Order Now
              </Link>
            </div>
          </div>

          {/* ===== MOBILE / TABLET ===== */}
          <div className="tablet:hidden grid grid-cols-3 items-center h-20">
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid place-items-center h-10 w-10 rounded-md"
              onClick={() => setMenuOpen(v => !v)}
            >
              <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"} text-3xl hover: cursor-pointer`} />
            </button>

            {/* bigger plain logo on mobile (no dent) */}
            <div className="grid place-items-center">
              <Link href="/" aria-label="Go home">
                <Image
                  src={logo}
                  alt="Grums"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT: Order Now stacked text */}
            {/* RIGHT: Order / Now + Call (mobile only) */}
            <div className="justify-self-end flex items-center gap-3 pr-2">
              {/* stacked Order / Now, centered together */}
              <div className="flex flex-col items-center leading-[1]">
                <Link href="/order" className="block m-0 p-0 text-green-600 font-semibold text-sm">Order</Link>
                <Link href="/order" className="block m-0 p-0 -mt-0.5 text-green-600 font-semibold text-sm">Now</Link>
              </div>

              {/* Call button (phone icon) */}
              <a
                href="tel:+12163214781"             
                aria-label="Call Grum’s"
                className="grid h-9 w-9 place-items-center rounded-full border border-grey-200 hover:bg-green-50 active:scale-95 transition"
              >
                <i className="bx bx-phone text-green-600 text-xl" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MOBILE/TABLET DRAWER ===== */}
      <div
        className={`sm:hidden fixed inset-x-0 top-20 z-30 origin-top bg-white transition-all duration-200 ${
          menuOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"
        } border-t border-gray-200 shadow-lg`}
      >
        <div className="px-4 pb-6 pt-4 space-y-4">
          <div className="relative">
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-500" />
            <input
              type="text"
              placeholder="Try: Nutrition and allergens"
              className="w-full h-12 rounded-full border border-gray-300 bg-white pl-10 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />
            <button
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i className="bx bx-x text-2xl" />
            </button>
          </div>

          <nav className="grid gap-4 text-2xl font-medium text-red-700">
            <Link href="/menu" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              Menu <i className="bx bx-chevron-right text-xl" />
            </Link>
            <Link href="/locations" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              <i className="bx bx-map-pin text-xl" />
              Find Us
            </Link>
          </nav>

          <div className="pt-2 grid gap-3">
            <Link
              href="/order"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full px-6 h-11 font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 shadow"
            >
              Order now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}