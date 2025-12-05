import React from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Executive Chef',
      description: 'Award-winning chef with 15+ years of experience in fine dining.',
      image: '/src/assets/images/chef.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Restaurant Manager',
      description: 'Hospitality expert dedicated to creating exceptional guest experiences.',
      image: '/src/assets/images/manager.jpg'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Accommodations',
      description: 'Ensuring every guest enjoys luxury and comfort during their stay.',
      image: '/src/assets/images/accommodations.jpg'
    },
    {
      name: 'David Kim',
      role: 'Sommelier',
      description: 'Wine connoisseur curating the perfect pairings for every dish.',
      image: '/src/assets/images/sommelier.jpg'
    }
  ];

  const values = [
    {
      icon: '🌟',
      title: 'Excellence',
      description: 'We strive for perfection in every dish and every service interaction.'
    },
    {
      icon: '❤️',
      title: 'Passion',
      description: 'Our love for culinary arts drives everything we create and serve.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'We build lasting relationships with our guests and local producers.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'We source locally and practice environmentally conscious operations.'
    }
  ];

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <AnimatedSection direction="up">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  For over a decade, Savory Bites has been redefining luxury dining 
                  and accommodation experiences. Our journey began with a simple vision: 
                  to create unforgettable moments through exceptional cuisine and service.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection direction="left">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    To deliver unparalleled culinary experiences by combining 
                    traditional techniques with innovative approaches, while 
                    maintaining the highest standards of service and sustainability.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    We believe that every meal should be a celebration, and every 
                    stay should feel like coming home to luxury.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection direction="right">
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-2xl p-8 h-64 flex items-center justify-center">
                  <span className="text-8xl">🎯</span>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <AnimatedSection direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Values
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} direction="up" delay={index * 100}>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection direction="up">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Meet Our Team
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  The passionate professionals behind your exceptional experience
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={member.name} direction="up" delay={index * 100}>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
                      <span className="text-6xl">👨‍🍳</span>
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection direction="up">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Experience Excellence?
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Join us for an unforgettable journey of taste and luxury. 
                Book your table or room today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/reservations">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Book a Table
                  </Button>
                </Link>
                <Link to="/accommodation">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                    View Rooms
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
};

export default AboutPage;