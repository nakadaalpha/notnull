import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import api from '../api';
import CarCard from '../components/CarCard';
import PageHero from '../components/PageHero';
import BrandMarquee from '../components/BrandMarquee';
import { Search } from 'lucide-react';

export default function Warehouse() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortYear, setSortYear] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');

  const gridRef = useRef(null);
  const contentRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (searchParams.get('brand') && contentRef.current && lenis) {
      setTimeout(() => {
        lenis.scrollTo(contentRef.current, {
          offset: -80, // Offset for navbar
          duration: 1.8, // Slightly longer duration for premium feel
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo.easeOut curve
        });
      }, 300);
    }
  }, [searchParams, lenis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, brandsRes] = await Promise.all([
          api.get('/cars'),
          api.get('/brands')
        ]);
        setCars(carsRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, cars]);

  // Handle filtering
  const filteredCars = [...cars].filter(car => {
    if (selectedBrand && car.brandId?.toString() !== selectedBrand && car.brand?.id?.toString() !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchModel = car.model.toLowerCase().includes(q);
      const matchBrand = car.brand?.name?.toLowerCase().includes(q);
      if (!matchModel && !matchBrand) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortYear === 'asc') return a.yearMade - b.yearMade;
    if (sortYear === 'desc') return b.yearMade - a.yearMade;
    if (sortPrice === 'asc') return a.price - b.price;
    if (sortPrice === 'desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full pb-32 bg-background min-h-screen">
      {/* Elegant Hero Section */}
      <div className="mb-16">
        <PageHero 
          imageUrl="/images/hero/warehouse.png"
          pretext="The Collection"
          title="Model"
          subtitleHighlight="Overview"
          titleLayout="center"
          heightClass="h-screen"
          overlayClass="bg-black/40"
        />
      </div>

      <section ref={contentRef} className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Brand Marquee */}
        <BrandMarquee 
          brands={brands} 
          selectedBrand={selectedBrand} 
          setSelectedBrand={setSelectedBrand} 
        />

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Sidebar Filter (Clean & Typography focused) */}
          <div className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <div className="sticky top-32">
              <h5 className="text-xs font-bold tracking-[0.2em] uppercase text-primary/40 mb-8 border-b border-primary/10 pb-4">
                Refine Search
              </h5>
              
              <div className="mb-8">
                <label className="block text-sm font-light mb-3 tracking-wide">Search</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search model..."
                    className="w-full p-4 bg-transparent border border-primary/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium rounded-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">
                    <Search size={16} />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-light mb-3 tracking-wide">Filter by Brand</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-transparent border border-primary/20 appearance-none focus:outline-none focus:border-primary transition-colors text-sm font-medium rounded-none"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="" className="dark:bg-black">All Brands</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id} className="dark:bg-black">{b.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">▼</div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-light mb-3 tracking-wide">Sort by Year</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-transparent border border-primary/20 appearance-none focus:outline-none focus:border-primary transition-colors text-sm font-medium rounded-none"
                    value={sortYear}
                    onChange={(e) => { setSortYear(e.target.value); setSortPrice(''); }}
                  >
                    <option value="" className="dark:bg-black">Default</option>
                    <option value="asc" className="dark:bg-black">Oldest to Newest</option>
                    <option value="desc" className="dark:bg-black">Newest to Oldest</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">▼</div>
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-sm font-light mb-3 tracking-wide">Sort by Price</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-transparent border border-primary/20 appearance-none focus:outline-none focus:border-primary transition-colors text-sm font-medium rounded-none"
                    value={sortPrice}
                    onChange={(e) => { setSortPrice(e.target.value); setSortYear(''); }}
                  >
                    <option value="" className="dark:bg-black">Default</option>
                    <option value="asc" className="dark:bg-black">Lowest to Highest</option>
                    <option value="desc" className="dark:bg-black">Highest to Lowest</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/50">▼</div>
                </div>
              </div>

              <button 
                onClick={() => { setSortYear(''); setSortPrice(''); setSelectedBrand(''); setSearchQuery(''); }}
                className="w-full py-4 text-xs font-bold tracking-widest uppercase border border-primary/20 hover:bg-primary hover:text-background transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Car Grid Content (Luxury Cards) */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {loading ? (
              <div className="text-center py-32">
                <span className="text-sm font-light tracking-widest uppercase animate-pulse">Loading collection...</span>
              </div>
            ) : filteredCars.length > 0 ? (
              <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 border border-primary/10">
                <p className="text-sm font-light tracking-widest uppercase text-primary/50">No vehicles match your refined criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
