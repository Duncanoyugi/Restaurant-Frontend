import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const nav = [
    {
      title: 'Explore',
      links: [
        { label: 'Menu', href: '/menu' },
        { label: 'Reservations', href: '/reservations' },
        { label: 'Accommodation', href: '/accommodation' },
        { label: 'Restaurants', href: '/restaurants' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
  ];

  const contactInfo = [
    { icon: MapPin, text: '123 Gourmet Street, Food City' },
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'hello@savorybites.com' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 py-16 border-b border-gray-800/60">
          {/* Brand column — spans 2 on md+ */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/15">
                <span className="text-white text-sm font-bold tracking-tight">SB</span>
              </div>
              <span className="text-lg font-bold text-white">
                Savory<span className="text-amber-400">Bites</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              World-class cuisine paired with luxury rooms for an unforgettable
              escape. Dine, stay, and experience.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {['twitter', 'instagram', 'facebook'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-gray-800/60 hover:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                  aria-label={social}
                >
                  {social === 'twitter' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                  {social === 'instagram' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )}
                  {social === 'facebook' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {nav.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column (hidden on small, shows on md+) */}
          <div className="col-span-2 md:col-span-1 hidden md:block">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((c) => (
                <li key={c.text} className="flex items-start gap-2.5 text-sm">
                  <c.icon className="h-4 w-4 mt-0.5 shrink-0 text-gray-600" />
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-xs">
          <p>&copy; {currentYear} Savory Bites. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-600">
            <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
