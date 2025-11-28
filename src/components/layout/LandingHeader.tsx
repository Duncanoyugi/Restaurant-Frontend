import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import Button from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle'; // Add this import

export const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/accommodation', label: 'Accommodation' },
    { path: '/reservations', label: 'Reservations' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' },
  ];

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  // Handle home click - scroll to top if already on home page
  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle cart click
  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/cart');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Simplified like FreshCart */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onClick={handleHomeClick}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg">SB</span>
            </div>
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Savory Bites
            </span>
          </Link>

          {/* Desktop Navigation - Centered like FreshCart */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.path === '/' ? handleHomeClick : undefined}
                className={`font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-primary-600 font-semibold'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary-600'
                    : 'text-white hover:text-primary-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Cart & Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Add Theme Toggle Here */}
            <ThemeToggle />

            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className={`relative p-2 transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-primary-600' 
                  : 'text-white hover:text-primary-200'
              }`}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartItems.length > 0 && (
                <span className={`absolute -top-1 -right-1 rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center ${
                  isScrolled 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-primary-600'
                }`}>
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  Hi, {(user as any)?.firstName ?? (user as any)?.name ?? 'Guest'}
                </span>
                <Link to="/dashboard">
                  <Button variant={isScrolled ? "primary" : "secondary"} size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant={isScrolled ? "outline" : "ghost"} 
                  size="sm"
                  onClick={handleLogout}
                  className={!isScrolled ? "text-white hover:bg-white/10" : ""}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button 
                    variant={isScrolled ? "outline" : "ghost"} 
                    size="sm"
                    className={!isScrolled ? "text-white hover:bg-white/10" : ""}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant="primary" 
                    size="sm"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 w-6 transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 transition-all duration-300 ${
                isScrolled ? 'bg-gray-600' : 'bg-white'
              } ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden mt-4 py-4 rounded-xl transition-all duration-300 ${
            isScrolled ? 'bg-white shadow-xl' : 'bg-white/95 backdrop-blur-md shadow-lg'
          }`}>
            <div className="flex flex-col space-y-3">
              {/* Add Theme Toggle to Mobile Menu */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-700">Theme</span>
                <ThemeToggle />
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => {
                    if (item.path === '/') handleHomeClick(e);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Cart Item */}
              <button
                onClick={() => {
                  handleCartClick();
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-left flex items-center justify-between ${
                  isScrolled 
                    ? 'text-gray-700 hover:bg-primary-50 hover:text-primary-600' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center bg-primary-600 text-white">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3 pt-4 px-4 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="text-center mb-2">
                      <span className="text-sm text-gray-600">
                        Welcome, {(user as any)?.firstName ?? (user as any)?.name ?? 'Guest'}
                      </span>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};