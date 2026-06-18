import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import api from '../api';
import { Settings2, Gauge } from 'lucide-react';

export default function Warehouse() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
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
      <section className="mb-16 w-full relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="/images/hero/warehouse.png" 
          alt="Warehouse Hero" 
          className="w-full h-full object-cover transform scale-105" 
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          <p className="text-white/60 text-xs font-bold tracking-[0.4em] uppercase mb-4">The Collection</p>
          <h1 className="text-white text-4xl md:text-6xl font-light tracking-[0.1em] uppercase">
            Model <span className="font-bold">Overview</span>
          </h1>
        </div>
      </section>

      <section ref={contentRef} className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Brand Marquee (Minimalist) */}
        <div className="w-full border-y border-primary/10 mb-16 overflow-hidden relative group">
          {/* Fading edges for the marquee effect */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex py-8 space-x-16 w-max animate-marquee-scroll px-8">
            {[...brands, ...brands, ...brands, ...brands].map((brand, idx) => (
              <div 
                key={`${brand.id}-${idx}`} 
                className={`flex-none w-24 h-14 flex items-center justify-center transition-all cursor-pointer ${selectedBrand === brand.id.toString() ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-100'}`}
                onClick={() => setSelectedBrand(selectedBrand === brand.id.toString() ? '' : brand.id.toString())}
              >
                <img 
                  src={brand.imageUrl ? `/images/brands/${brand.imageUrl}` : `/images/brands/${brand.name.toLowerCase()}.png`} 
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain filter dark:invert hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Sidebar Filter (Clean & Typography focused) */}
          <div className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <div className="sticky top-32">
              <h5 className="text-xs font-bold tracking-[0.2em] uppercase text-primary/40 mb-8 border-b border-primary/10 pb-4">
                Refine Search
              </h5>
              
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
                onClick={() => { setSortYear(''); setSortPrice(''); setSelectedBrand(''); }}
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
                  <div key={car.id} className="group cursor-pointer flex flex-col h-full bg-background" onClick={() => window.location.href=`/car/${car.id}`}>
                    <div className="aspect-[4/3] bg-secondary/20 dark:bg-white/5 p-8 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none"></div>
                      <img 
                        src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
                        alt={car.model}
                        className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-0"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Premium+Vehicle'; }}
                      />
                    </div>
                    <div className="pt-6 pb-4 flex-grow flex flex-col justify-between border-b border-primary/10 group-hover:border-primary/50 transition-colors duration-500">
                      <div>
                        <p className="text-primary/50 text-xs font-bold tracking-[0.2em] uppercase mb-1">
                          {car.brand?.name}
                        </p>
                        <h5 className="font-bold text-2xl uppercase tracking-wide mb-2">
                          {car.model}
                        </h5>
                        {car.specifications?.performance && (
                          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 mb-2">
                            {car.specifications.performance.engine_type && (
                              <div className="flex items-center text-primary/70">
                                <Settings2 size={14} className="mr-2" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{car.specifications.performance.engine_type}</span>
                              </div>
                            )}
                            {car.specifications.performance.horsepower && (
                              <div className="flex items-center text-primary/70">
                                <Gauge size={14} className="mr-2" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{car.specifications.performance.horsepower.split(' @')[0]}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div>
                          <p className="text-xs font-light text-primary/60 mb-1">From</p>
                          <span className="font-light text-xl">${car.price.toLocaleString()}</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase hover:underline">
                          Explore &rsaquo;
                        </span>
                      </div>
                    </div>
                  </div>
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
