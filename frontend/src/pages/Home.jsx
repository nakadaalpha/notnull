import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const heroRef = useRef(null);
  const highlightRef = useRef(null);
  const brandsRef = useRef(null);

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/brands')
        ]);
        // Limit highlight cars to 3 for the home page
        setCars(carsRes.data.slice(0, 3));
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cars.length > 0 || brands.length > 0) {
      // Hero Animation - Gentle fade and scale up
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
      );

      // Highlight Cars Stagger
      if (highlightRef.current && highlightRef.current.children.length > 0) {
        gsap.fromTo(
          highlightRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: highlightRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Brands Stagger
      if (brandsRef.current && brandsRef.current.children.length > 0) {
        gsap.fromTo(
          brandsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: brandsRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }
  }, [cars, brands]);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Elegant Hero Section */}
      <section className="w-full relative h-[70vh] md:h-[85vh] overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src="/images/hero/home-hero.png" 
          alt="Luxury Cars" 
          className="w-full h-full object-cover transform scale-105" 
        />
        <div className="absolute bottom-12 left-6 md:left-12 z-20">
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl">
            Experience <br/> <span className="text-white/70 font-light">The Extraordinary.</span>
          </h1>
        </div>
      </section>

      {/* Luxury HIGHLIGHT Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
        <div className="flex items-end justify-between mb-16 border-b border-primary/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-light tracking-widest uppercase">
            Curated <span className="font-bold">Fleet</span>
          </h2>
          <Link to="/warehouse" className="hidden md:block text-sm font-bold tracking-widest uppercase hover:opacity-60 transition-opacity">
            View All Models
          </Link>
        </div>
        
        <div ref={highlightRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} className="group cursor-pointer">
                <Link to={`/car/${car.id}`} className="block h-full">
                  <div className="bg-secondary/20 dark:bg-black/20 overflow-hidden h-full flex flex-col transition-all duration-500 hover:bg-secondary/40 border border-transparent hover:border-primary/10 shadow-sm hover:shadow-2xl">
                    <div className="aspect-[16/10] overflow-hidden bg-white/50 dark:bg-white/5 p-8 flex items-center justify-center relative">
                      {/* Subtle Vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none"></div>
                      
                      <img 
                        src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
                        alt={car.model}
                        className="w-full h-full object-contain relative z-0 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Premium+Vehicle'; }}
                      />
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-between relative bg-background">
                      {/* Decorative Line */}
                      <div className="absolute top-0 left-8 w-12 h-[1px] bg-primary/30 group-hover:w-full group-hover:left-0 transition-all duration-700"></div>
                      
                      <div>
                        <p className="text-primary/50 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                          {car.brand?.name}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-4">
                          {car.model}
                        </h3>
                      </div>
                      <div className="mt-8 flex justify-between items-center">
                        <span className="text-lg font-light">${car.price.toLocaleString()} / day</span>
                        <span className="text-xs font-bold tracking-widest uppercase hover:underline">Discover</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-3 h-40 flex items-center justify-center border border-primary/10">
              <p className="text-primary/40 font-light tracking-widest uppercase">No vehicles currently available</p>
            </div>
          )}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Link to="/warehouse" className="inline-block border border-primary px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-primary hover:text-background transition-colors">
            View All Models
          </Link>
        </div>
      </section>

      {/* Elegant BRANDS Section */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 mb-20 bg-secondary/10 dark:bg-black/20 border-y border-primary/5">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-primary/50 mb-4">Partner Manufacturers</h2>
          <h3 className="text-3xl md:text-4xl font-light tracking-widest uppercase">
            World-Class <span className="font-bold">Engineering</span>
          </h3>
        </div>
        
        <div ref={brandsRef} className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <Link to="/warehouse" key={brand.id} className="block group">
                <div className="h-32 flex flex-col items-center justify-center transition-all duration-500">
                  <img 
                    src={brand.imageUrl ? `/images/brands/${brand.imageUrl}` : `/images/brands/${brand.name.toLowerCase()}.png`} 
                    alt={brand.name}
                    className="max-h-16 max-w-[120px] object-contain opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 filter dark:invert"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="mt-6 text-xs font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {brand.name}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-4 text-center">
              <p className="text-primary/40 font-light tracking-widest uppercase">Partner data unavailable</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
