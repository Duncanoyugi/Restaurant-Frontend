import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  image: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

interface ImageSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  slides,
  autoPlay = true,
  interval = 5000,
}) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, next]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl shadow-black/10 aspect-[16/8] min-h-[360px] max-h-[560px] bg-gray-900">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content — anchored bottom-left */}
          <div className="absolute inset-0 flex items-end p-8 md:p-12 z-10">
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {slide.title}
              </h3>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-5 line-clamp-3">
                {slide.description}
              </p>
              {slide.ctaText && slide.ctaLink && (
                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-semibold rounded-lg transition-colors"
                >
                  {slide.ctaText}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
