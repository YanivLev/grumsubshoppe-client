import Link from 'next/link';
import GrumsLogo from '../../atoms/GrumsLogo';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 pt-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
              <Link href="/" aria-label="Go home">
                <GrumsLogo size="lg"/>
              </Link>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Navigate</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/#menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/order" className="hover:text-white transition-colors">Order Online</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a
                  href="tel:+12163214781"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <i className="bx bx-phone text-green-500 text-lg" />
                  (216) 321-4781
                </a>
              </li>
              <li>
                <a
                  href="mailto:grumssubshoppe@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <i className="bx bx-envelope text-green-500 text-lg" />
                    grumssubshoppe@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/qeSogw7jGB7Jp6QV7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <i className="bx bx-map text-green-500 text-lg" />
                  1776 Coventry Rd, Cleveland Heights, OH
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Hours</p>
            <ul className="space-y-1 text-sm text-gray-300">
              <li className="flex justify-between gap-4"><span>Open Everyday</span><span>11am – 6pm</span></li>
              <li className="flex justify-between gap-4"><span>Phone/Online Orders</span><span>12pm – 5pm</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t pb-5 border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} Grum's Sub Shoppe. All rights reserved.</p>
          <a
            href="https://maps.app.goo.gl/qeSogw7jGB7Jp6QV7"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            1776 Coventry Rd, Cleveland Heights, OH 44118
          </a>
        </div>

      </div>
    </footer>
  );
}
