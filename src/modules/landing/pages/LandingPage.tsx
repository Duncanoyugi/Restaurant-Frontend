import React from 'react';
import { LandingLayout } from '@/shared/layouts/LandingLayout';
import { HeroSection } from '@/shared/components/HeroSection';
import { ImageSlider } from '@/shared/components/ImageSlider';
import { AnimatedSection } from '@/shared/components/AnimatedSection';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  CalendarDays,
  BedDouble,
  ChefHat,
  Star,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Users,
} from 'lucide-react';
import { useGetMenuItemsQuery } from '@/modules/menu/api/menuApi';
import { useGetAllRoomsQuery } from '@/modules/rooms/api/roomsApi';

const LandingPage: React.FC = () => {
  const { data: menuItemsData } = useGetMenuItemsQuery({ available: true, limit: 6 });
  const { data: roomsData } = useGetAllRoomsQuery({ limit: 3 });

  const placeholderDishes = [
    { id: 'p1', name: 'Grilled Lamb Chops', description: 'Tender herb-crusted lamb chops served with rosemary jus, roasted vegetables, and creamy mashed potatoes.', price: 2500, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
    { id: 'p2', name: 'Pan-Seared Salmon', description: 'Fresh Atlantic salmon with a crispy skin, lemon butter sauce, and seasonal greens.', price: 1800, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80' },
    { id: 'p3', name: 'Truffle Risotto', description: 'Creamy Arborio rice finished with black truffle, aged parmesan, and a drizzle of truffle oil.', price: 1600, imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop&q=80' },
    { id: 'p4', name: 'Nyama Choma Platter', description: 'Traditional Kenyan grilled meat served with ugali, kachumbari, and spicy sauce.', price: 2200, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80' },
    { id: 'p5', name: 'Seafood Pasta', description: 'Linguine tossed with prawns, mussels, calamari in a white wine and garlic sauce.', price: 1900, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80' },
    { id: 'p6', name: 'Chocolate Lava Cake', description: 'Warm dark chocolate fondant with a molten center, served with vanilla bean ice cream.', price: 850, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80' },
  ];

  const featuredMenuItems = menuItemsData?.data?.slice(0, 6) || placeholderDishes;
  const placeholderRooms = [
    { id: 'r1', name: 'Deluxe Suite', description: 'Spacious suite with king-size bed, private balcony, and panoramic city views. Includes complimentary breakfast.', pricePerNight: 8500, bedType: 'King', capacity: 2, imageGallery: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=80'] },
    { id: 'r2', name: 'Executive Room', description: 'Modern room with queen bed, work desk, and en-suite bathroom. Perfect for business travelers.', pricePerNight: 5500, bedType: 'Queen', capacity: 2, imageGallery: ['https://images.unsplash.com/photo-1590490360182-c33d955f3a63?w=600&auto=format&fit=crop&q=80'] },
    { id: 'r3', name: 'Family Villa', description: 'Two-bedroom villa with living area, kitchenette, and garden access. Ideal for families and extended stays.', pricePerNight: 12000, bedType: 'Twin + King', capacity: 4, imageGallery: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80'] },
  ];

  const featuredRooms = roomsData?.data?.slice(0, 3) || placeholderRooms;

  const sliderSlides = [
    {
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
      title: 'Elegant Dining',
      description:
        'A beautifully designed hall crafted for comfort — perfect for dates, family gatherings, and celebrations.',
      ctaText: 'Explore Menu',
      ctaLink: '/menu',
    },
    {
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
      title: 'Culinary Art',
      description:
        'Dishes created with locally-sourced ingredients and international inspiration. Every plate tells a story.',
      ctaText: 'See the Menu',
      ctaLink: '/menu',
    },
    {
      image:
        'https://images.unsplash.com/photo-1590490360182-c33d955f3a63?w=1200&auto=format&fit=crop&q=80',
      title: 'Luxury Rooms',
      description:
        'Retreat to elegantly appointed rooms with premium amenities and breathtaking views.',
      ctaText: 'View Rooms',
      ctaLink: '/accommodation',
    },
  ];

  return (
    <LandingLayout>
      {/* ── Hero ───────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Quick-access service strip ─────────────────────── */}
      <section className="relative z-10 -mt-14">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection direction="up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden shadow-xl shadow-black/5 border border-gray-200/60 dark:border-gray-700/40">
              {[
                {
                  icon: UtensilsCrossed,
                  title: 'Dine In',
                  desc: 'Explore our seasonal menus',
                  to: '/menu',
                  accent: 'text-amber-600 dark:text-amber-400',
                  bg: 'bg-white dark:bg-gray-800',
                },
                {
                  icon: CalendarDays,
                  title: 'Reservations',
                  desc: 'Book your perfect table',
                  to: '/reservations',
                  accent: 'text-emerald-600 dark:text-emerald-400',
                  bg: 'bg-white dark:bg-gray-800',
                },
                {
                  icon: BedDouble,
                  title: 'Stay With Us',
                  desc: 'Luxury rooms & suites',
                  to: '/accommodation',
                  accent: 'text-indigo-600 dark:text-indigo-400',
                  bg: 'bg-white dark:bg-gray-800',
                },
              ].map((s) => (
                <Link
                  key={s.title}
                  to={s.to}
                  className={`${s.bg} group flex items-center gap-5 px-7 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors`}
                >
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${s.accent} bg-current/8`}
                  >
                    <s.icon className={`h-5.5 w-5.5 ${s.accent}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{s.desc}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Gallery Showcase ───────────────────────────────── */}
      <section className="py-24 bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-2">
                Gallery
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Step Inside
              </h2>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ImageSlider slides={sliderSlides} />
        </div>
      </section>

      {/* ── Featured Dishes ────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection direction="up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
                  From Our Kitchen
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Featured Dishes
                </h2>
              </div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Full menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMenuItems.map((item, i) => (
              <div key={item.id} className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-400">
                      KSh {item.price.toLocaleString()}
                    </span>
                    <Link
                      to="/menu"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      View <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ─────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
                Accommodations
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Luxury Rooms
              </h2>
            </div>
            <Link
              to="/accommodation"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              All rooms <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}`}
                className="group block bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.imageGallery?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d955f3a63?w=600&auto=format&fit=crop&q=80'}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1590490360182-c33d955f3a63?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-sm font-semibold text-white">
                    KSh {room.pricePerNight.toLocaleString()}
                    <span className="text-gray-400 font-normal">/night</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-1">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {room.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {room.bedType || 'King'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {room.capacity} guests
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                      View <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Why Us ─────────────────────────────────── */}
      <section className="py-24 bg-gray-900 dark:bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
                Why Savory Bites
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Crafted for Every Moment
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ChefHat,
                title: 'Award-Winning Chefs',
                desc: 'Decades of culinary expertise creating memorable flavors with seasonal, locally-sourced ingredients.',
              },
              {
                icon: Star,
                title: '5-Star Experience',
                desc: 'Dedicated staff ensuring every detail — from arrival to farewell — exceeds your expectations.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality Guaranteed',
                desc: 'Premium ingredients, luxury amenities, and meticulous attention to hygiene and safety standards.',
              },
            ].map((card, i) => (
              <AnimatedSection key={card.title} direction="up" delay={i * 120}>
                <div className="text-center p-8">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
                    <card.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 text-center">
          <AnimatedSection direction="up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Experience It?
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10">
              Book your table or room today and discover why guests keep coming back.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Get Started Free
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all"
              >
                <MapPin className="h-4.5 w-4.5" />
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;
