import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import CarCard from '../components/CarCard';
import InventoryWidget from '../components/InventoryWidget';
import TrustSignals from '../components/TrustSignals';
import ValueAddedServices from '../components/ValueAddedServices';
import ContactLocation from '../components/ContactLocation';
import BrandsGrid from '../components/BrandsGrid';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const heroRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/brands')
        ]);
        
        const allCars = carsRes.data;
        // Show 6 featured cars
        setCars(allCars.slice(0, 6));
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cars.length > 0 || brands.length > 0) {
      // Highlight Cars Stagger
      if (highlightRef.current && highlightRef.current.children.length > 0) {
        gsap.fromTo(
          highlightRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: highlightRef.current, start: 'top 85%' }
          }
        );
      }
    }
  }, [cars, brands]);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* 1. Hero Area (Visual Premium & USP) */}
      <section className="relative w-full h-screen min-h-[800px] overflow-hidden flex items-center" ref={heroRef}>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          poster="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80"
        >
          {/* We use a static image fallback in the poster, assuming we don't have a real video yet */}
        </video>
        <img 
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80" 
          alt="Luxury Car"
          className="absolute inset-0 w-full h-full object-cover z-0 transform scale-105"
        />
        
        <div className="relative z-20 max-w-[1400px] mx-auto w-full px-6 md:px-12 flex flex-col justify-center">
          <p className="text-white/80 text-sm font-bold tracking-[0.4em] uppercase mb-4 flex items-center">
            <Sparkles size={16} className="mr-2" />
            The Ultimate Garage
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1] drop-shadow-2xl mb-6 max-w-3xl">
            Premium Vehicles, Rigorously Inspected, & Fully Warrantied.
          </h1>
          <p className="text-white/80 text-base md:text-lg font-light mb-8 max-w-2xl">
            We are changing the way you buy luxury cars. Full transparency, uncompromising quality assurance, and an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/warehouse" className="bg-primary text-background font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center">
              Explore Collection <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/warehouse" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center">
              <Play size={18} className="mr-2 fill-white" /> Schedule Test Drive
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Inventory Widget (Smart Search) */}
      <InventoryWidget />

      {/* 3. Featured Vehicles (Etalase Unggulan) */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary/50 mb-2">New Arrivals</h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-widest uppercase">
            Special Offers
          </h3>
        </div>
        
        <div ref={highlightRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {cars.length > 0 ? (
            cars.map((car) => <CarCard key={car.id} car={car} />)
          ) : (
            <div className="col-span-3 h-40 flex items-center justify-center border border-primary/10">
              <p className="text-primary/40 font-light tracking-widest uppercase">Catalog is being updated</p>
            </div>
          )}
        </div>
        <div className="mt-16 text-center">
          <Link to="/warehouse" className="inline-block border border-primary px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary hover:text-background transition-colors">
            View All Vehicles
          </Link>
        </div>
      </section>

      {/* 4. Trust Signals & Testimonials */}
      <TrustSignals />

      {/* 5. Value-Added Services (Trade-In & Financing) */}
      <ValueAddedServices />

      {/* Brands Grid (from old layout) */}
      <div className="border-t border-primary/10 pt-12">
        <BrandsGrid brands={brands} />
      </div>

      {/* 6. Contact & Google Maps */}
      <ContactLocation />
      
    </div>
  );
}
