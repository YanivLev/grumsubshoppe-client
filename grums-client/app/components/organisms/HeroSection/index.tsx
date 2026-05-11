'use client'

export default function HeroSection() {
  return (
    <section
      style={{ backgroundColor: '#0d1f12' }}
      className="relative min-h-[calc(100svh-5rem)] lg:min-h-[calc(75svh-7rem)] flex flex-col items-center justify-center text-white px-6 overflow-hidden"
    >

      {/* radial green glow */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(34,197,94,0.22), transparent)' }}
      />

      <div className="relative z-10 text-center max-w-3xl">
        <p className="text-green-400 uppercase tracking-[0.3em] text-xs font-semibold mb-6">
          Fresh · Handcrafted · Since 1977
        </p>

        <h1 className="text-[45px] lg:text-8xl font-black uppercase italic leading-[0.9] mb-8 tracking-tight">
          <span className="block whitespace-nowrap">#1 SUBS</span>
          <span className="block">In Cleveland.</span>
        </h1>

        <p className="text-gray-300 text-base mb-10 max-w-xs mx-auto leading-relaxed">
        The subs Clevelanders have been coming back to for years. Fresh, filling, and exactly what you'd expect from the best.
        </p>

        <button
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold px-10 py-4 rounded-full text-lg transition-all cursor-pointer"
        >
          See the Menu
        </button>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #ffffff, rgba(255,255,255,0))' }} />
    </section>
  );
}
