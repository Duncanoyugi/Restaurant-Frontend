import React from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { HeroSection } from '../components/ui/HeroSection';
import { ImageSlider } from '../components/ui/ImageSlider';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const sliderSlides = [
    {
      image: 'https://images.unsplash.com/photo-1682778418768-16081e4470a1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D',
      title: 'Elegant Dining Experience',
      description: 'Step into our beautifully designed restaurant hall where every detail is crafted for your comfort and enjoyment. Perfect for romantic dinners, family gatherings, and business meetings.',
      ctaText: 'View Gallery',
      ctaLink: '/gallery'
    },
    {
      image: 'https://images.unsplash.com/photo-1568360987818-833c9383a326?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJlc3RhdXJhbnQlMjBrZW55YW4lMjBmb29kfGVufDB8fDB8fHww',
      title: 'Culinary Masterpieces',
      description: 'Our chefs create unforgettable dishes using the finest ingredients sourced locally and internationally. Each plate is a work of art that delights all senses.',
      ctaText: 'Explore Menu',
      ctaLink: '/menu'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1661434796182-a411d8782d68?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODZ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
      title: 'Perfect Table Settings',
      description: 'From intimate candlelit dinners to grand celebrations, our table arrangements set the stage for memorable moments and exceptional dining experiences.',
      ctaText: 'Book a Table',
      ctaLink: '/reservations'
    },
    {
      image: 'https://images.unsplash.com/photo-1669664880587-b6bb10e8dd64?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYzfHxyZXN0YXVyYW50JTIwYWNjb21tb2RhdGlvbiUyMHJvb21zfGVufDB8fDB8fHww',
      title: 'Luxury Accommodations',
      description: 'Retreat to our elegantly appointed bedrooms after your dining experience. Enjoy premium amenities and breathtaking views in complete comfort.',
      ctaText: 'View Rooms',
      ctaLink: '/accommodation'
    }
  ];

  return (
    <LandingLayout>
      <HeroSection />
      
      {/* Image Slider Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Discover Our World
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Experience the perfect blend of gourmet dining and luxury accommodation
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection direction="up" delay={200}>
            <ImageSlider slides={sliderSlides} />
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Savory Bites?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We combine exceptional cuisine with unparalleled service
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection direction="up" delay={100}>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">👨‍🍳</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Award-Winning Chefs</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our culinary team brings decades of experience and innovation to every dish, 
                  creating memorable flavors that keep guests coming back.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={200}>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-gray-600 dark:to-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-secondary-600 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5-Star Service</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  From the moment you arrive until you depart, our dedicated staff ensures 
                  every aspect of your experience exceeds expectations.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={300}>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-white">🏨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Luxury Stay</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our accommodations feature premium amenities, stunning views, 
                  and thoughtful touches for the ultimate comfort and relaxation.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection direction="up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience Excellence?
            </h2>
            <p className="text-xl text-primary-100 dark:text-primary-200 mb-8 max-w-2xl mx-auto">
              Join us for an unforgettable journey of taste and luxury. Book your table or room today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-white dark:text-primary-700 dark:hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </LandingLayout>
  );
};

export default LandingPage;