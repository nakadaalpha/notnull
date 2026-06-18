import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, Globe, Truck, Diamond, Gauge } from 'lucide-react';
import { EngineIcon, EvIcon } from '../components/Icons';
import CarCard from '../components/CarCard';
import PageHero from '../components/PageHero';
import AdvantagesSection from '../components/AdvantagesSection';
import BrandsGrid from '../components/BrandsGrid';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [recommendedCars, setRecommendedCars] = useState([]);
  
  const heroRef = useRef(null);
  const highlightRef = useRef(null);
  const brandsRef = useRef(null);
  const recommendedRef = useRef(null);
  const advantagesRef = useRef(null);

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/brands')
        ]);
        
        const allCars = carsRes.data;
        setCars(allCars.slice(0, 3));
        setBrands(brandsRes.data);

        // AI Personalization Logic (Login-Free Customization)
        try {
          const tracked = JSON.parse(localStorage.getItem('trackedBrands') || '[]');
          if (tracked.length > 0) {
            const matches = allCars.filter(car => tracked.includes(car.brand?.name));
            // Show up to 3 recommendations
            setRecommendedCars(matches.slice(0, 3));
          }
        } catch (e) {
          console.error("Failed to read tracking logic", e);
        }

      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (cars.length > 0 || brands.length > 0) {
      // Hero Animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
      );

      // Recommended Cars Stagger
      if (recommendedRef.current && recommendedRef.current.children.length > 0) {
        gsap.fromTo(
          recommendedRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out',
            scrollTrigger: { trigger: recommendedRef.current, start: 'top 85%' }
          }
        );
      }

      // Highlight Cars Stagger
      if (highlightRef.current && highlightRef.current.children.length > 0) {
        gsap.fromTo(
          highlightRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out',
            scrollTrigger: { trigger: highlightRef.current, start: 'top 85%' }
          }
        );
      }

      // Advantages Section Animate
      if (advantagesRef.current && advantagesRef.current.children.length > 0) {
        gsap.fromTo(
          advantagesRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'expo.out',
            scrollTrigger: { trigger: advantagesRef.current, start: 'top 85%' }
          }
        );
      }

      // Brands Stagger
      if (brandsRef.current && brandsRef.current.children.length > 0) {
        gsap.fromTo(
          brandsRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: brandsRef.current, start: 'top 90%' }
          }
        );
      }
    }
  }, [cars, brands, recommendedCars]);


  return (
    <div className="w-full bg-background min-h-screen">
      {/* Elegant Hero Section */}
      <PageHero 
        ref={heroRef}
        imageUrl="/images/hero/home-hero.png"
        title="Experience"
        subtitle="The Extraordinary."
      />

      {/* The NOTNULL Difference Section */}
      <AdvantagesSection ref={advantagesRef} />

      {/* AI Personalization Section */}
      {recommendedCars.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 pt-24 pb-8 border-b border-primary/5">
          <div className="flex flex-col mb-12">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/50 mb-2 flex items-center">
              <Sparkles size={14} className="mr-2" /> Smart Recommendations
            </h2>
            <h3 className="text-3xl md:text-4xl font-light tracking-widest uppercase">
              Curated <span className="font-bold">For You</span>
            </h3>
          </div>
          <div ref={recommendedRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {recommendedCars.map((car) => <CarCard key={car.id} car={car} isRecommended={true} />)}
          </div>
        </section>
      )}

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
            cars.map((car) => <CarCard key={car.id} car={car} />)
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
      <BrandsGrid ref={brandsRef} brands={brands} />
    </div>
  );
}
