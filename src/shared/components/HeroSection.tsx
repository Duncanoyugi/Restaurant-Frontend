import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Bed, ArrowDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content — pinned to the bottom third */}
      <div className="relative w-full pb-24 pt-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag */}
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium tracking-widest uppercase mb-6">
              Restaurant &amp; Accommodation
            </span>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
              Savory
              <br />
              <span className="text-amber-400">Bites</span>
            </h1>

            {/* Subline */}
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-10">
              World-class cuisine by award-winning chefs, paired with luxury rooms
              for an unforgettable escape. Dine, stay, and experience.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/reservations"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/30"
              >
                <UtensilsCrossed className="h-4.5 w-4.5" />
                Reserve a Table
              </Link>
              <Link
                to="/accommodation"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 transition-all duration-200"
              >
                <Bed className="h-4.5 w-4.5" />
                Book a Room
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-4">
            {[
              { value: '50+', label: 'Dishes' },
              { value: '12', label: 'Luxury Rooms' },
              { value: '4.9', label: 'Guest Rating' },
              { value: '24/7', label: 'Service' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold text-white">{s.value}</span>
                <span className="text-sm text-gray-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <ArrowDown className="h-5 w-5" />
      </div>
    </section>
  );
};
