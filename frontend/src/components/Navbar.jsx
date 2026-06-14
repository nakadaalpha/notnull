import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { User, Sun, Moon, ChevronRight, X } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Vehicle Collection', path: '/warehouse' },
    { name: 'Admin Portal', path: '/admin' }
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled && !isMenuOpen
            ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm py-4 text-foreground' 
            : 'bg-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Left: Hamburger Menu */}
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center space-x-3 group outline-none hover:opacity-70 transition-opacity"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className="block w-6 h-[2px] bg-current transition-all duration-300 group-hover:w-8"></span>
                <span className="block w-6 h-[2px] bg-current transition-all duration-300"></span>
                <span className="block w-4 h-[2px] bg-current transition-all duration-300 group-hover:w-8"></span>
              </div>
              <span className="hidden md:block text-sm font-bold tracking-widest uppercase">
                Menu
              </span>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-none text-center z-50">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-widest uppercase" style={{ letterSpacing: '0.2em' }} onClick={() => setIsMenuOpen(false)}>
              NOT<span className="text-primary/50 font-light">NULL</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center space-x-6 z-50">
            <button 
              onClick={toggleTheme} 
              className="hover:opacity-60 transition-transform hover:rotate-180 duration-500 outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>
            <Link to="/login" className="hover:opacity-60 transition-transform hover:scale-110 duration-300">
              <User size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-700 flex ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Blurry Dark Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md transition-opacity duration-700"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Sidebar (Slides from left) */}
        <div 
          className={`relative w-full md:w-[450px] h-full bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-r border-primary/10 text-foreground shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Desktop X button (outside right) */}
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="hidden md:flex absolute top-6 -right-20 w-12 h-12 rounded-full bg-white/10 dark:bg-white/5 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:rotate-90"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {/* Header of Sidebar */}
          <div className="w-full flex items-center justify-between px-10 py-8 border-b border-primary/10">
            <span className="text-2xl md:text-3xl font-black tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
              NOT<span className="text-primary/50 font-light">NULL</span>
            </span>
            
            {/* Mobile X button (inside) */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden w-10 h-10 rounded-full hover:bg-primary/10 flex items-center justify-center transition-all duration-300 hover:rotate-90"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-grow overflow-y-auto px-10 py-12">
            <ul className="flex flex-col space-y-2">
              {menuItems.map((item, index) => (
                <li key={item.name} 
                    className={`transform transition-all duration-500 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                    style={{ transitionDelay: `${100 + (index * 100)}ms` }}
                >
                  <Link
                    to={item.path}
                    className="group flex items-center justify-between py-5 border-b border-primary/5 hover:border-primary/30 transition-colors duration-300 relative overflow-hidden"
                  >
                    <span className="text-2xl font-light tracking-wide group-hover:translate-x-2 transition-transform duration-300">{item.name}</span>
                    <ChevronRight size={20} strokeWidth={1} className="text-primary/30 group-hover:text-primary group-hover:-translate-x-2 transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Footer of Sidebar */}
          <div className="px-10 py-12 bg-secondary/5 border-t border-primary/10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mb-4">Account</p>
            <div className="flex flex-col space-y-4">
              <Link to="/login" className="text-sm font-bold tracking-widest hover:text-primary/60 transition-colors">Sign In</Link>
              <Link to="/register" className="text-sm font-bold tracking-widest hover:text-primary/60 transition-colors">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
