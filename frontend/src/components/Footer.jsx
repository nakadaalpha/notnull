import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { MapPin } from 'lucide-react';
import Modal from './Modal';

export default function Footer() {
  const AnimatedLink = ({ to, href, children }) => {
    const baseClasses = "group relative inline-flex items-center text-xs font-light tracking-widest uppercase text-foreground/80 hover:text-foreground transition-colors py-1";
    const underline = <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 ease-out group-hover:w-full"></span>;
    
    if (href) {
      return (
        <a href={href} className={baseClasses}>
          {children}
          {underline}
        </a>
      );
    }
    
    return (
      <Link to={to} className={baseClasses}>
        {children}
        {underline}
      </Link>
    );
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/maps?q=Pantai%20Indah%20Kapuk%202,%20Jakarta&t=&z=14&ie=UTF8&iwloc=&output=embed");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/showroom_map');
        if (res.data && res.data.value) {
          setMapUrl(res.data.value);
        }
      } catch (error) {
        // Fallback to default if not found
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="w-full bg-secondary/5 dark:bg-white/5 border-t border-primary/10 pt-20 pb-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Vision */}
          <div className="lg:col-span-1">
            <Link to="/" className="text-3xl font-black tracking-widest uppercase block mb-6" style={{ letterSpacing: '0.2em' }}>
              NOT<span className="text-primary/50 font-light">NULL</span>
            </Link>
            <p className="text-xs text-primary/60 font-light leading-relaxed max-w-sm">
              The premier destination for highly curated, pre-owned luxury and performance vehicles. Elevating the automotive retail experience through digital excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <AnimatedLink to="/">Home</AnimatedLink>
              </li>
              <li>
                <AnimatedLink to="/warehouse">The Collection</AnimatedLink>
              </li>
              <li>
                <AnimatedLink to="/admin">Admin Portal</AnimatedLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 mb-6">Concierge</h4>
            <ul className="space-y-4">
              <li className="text-xs font-light tracking-widest uppercase">
                <span className="block text-primary/50 mb-1 text-[10px]">Email</span>
                vip@notnull.com
              </li>
              <li className="text-xs font-light tracking-widest uppercase">
                <span className="block text-primary/50 mb-1 text-[10px]">Phone</span>
                +1 (800) 555-NULL
              </li>
              <li className="text-xs font-light tracking-widest uppercase">
                <span className="block text-primary/50 mb-1 text-[10px]">Showroom</span>
                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="group flex items-center hover:text-primary transition-colors text-left"
                >
                  <MapPin size={14} className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">
                    Pondok Indah Kapuk 2
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 mb-6">Follow Us</h4>
            <ul className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <li>
                <AnimatedLink href="#">
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  Instagram
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink href="#">
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  Twitter
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink href="#">
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  YouTube
                </AnimatedLink>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-[10px] text-primary/40 tracking-[0.2em] uppercase font-bold">
            &copy; {new Date().getFullYear()} NOTNULL AUTOMOTIVE. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <AnimatedLink href="#">Privacy Policy</AnimatedLink>
            <AnimatedLink href="#">Terms of Service</AnimatedLink>
          </div>
        </div>
      </div>

      {/* Showroom Location Modal */}
      <Modal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} title="Visit Our Showroom" maxWidth="max-w-4xl">
        <div className="w-full h-[60vh] bg-secondary/10 rounded-xl overflow-hidden relative">
          <iframe 
            src={mapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </div>
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h4 className="font-bold text-lg tracking-widest uppercase">NotNull Premium Cars</h4>
            <p className="text-sm text-primary/60 mt-1">Kawasan Pantai Indah Kapuk 2 (PIK 2), Jakarta</p>
          </div>
          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p className="text-xs font-bold tracking-widest uppercase text-primary/50">Operating Hours</p>
            <p className="text-sm mt-1">Mon - Sun: 09:00 - 21:00</p>
          </div>
        </div>
      </Modal>
    </footer>
  );
}
