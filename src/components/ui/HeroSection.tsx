import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background Video/Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1670984939697-ba4e444c537f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEzfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-primary-600/10 to-secondary-600/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-secondary-600/10 to-primary-600/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading with Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Savory
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary-300 to-primary-300 bg-clip-text text-transparent">
              Bites
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 leading-relaxed font-light">
            Where <span className="text-secondary-300 font-semibold">Culinary Art</span> Meets{' '}
            <span className="text-primary-300 font-semibold">Luxury Experience</span>
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Indulge in world-class cuisine crafted by award-winning chefs, 
            and retreat to our luxurious accommodations for an unforgettable stay.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/reservations">
              <Button size="lg" className="shadow-2xl hover:shadow-3xl transform hover:scale-110">
                🍽️ Make a Reservation
              </Button>
            </Link>
            <Link to="/accommodation">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gray-900">
                🛏️ Book a Stay
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300">Menu Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5★</div>
              <div className="text-gray-300">Luxury Rooms</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};