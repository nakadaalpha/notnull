import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import api from '../api';

export default function InventoryWidget() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    api.get('/brands')
      .then(res => setBrands(res.data))
      .catch(err => console.error("Failed to load brands for widget", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (priceRange) params.append('maxPrice', priceRange);
    if (year) params.append('year', year);
    
    navigate(`/warehouse?${params.toString()}`);
  };

  return (
    <div className="bg-background/80 backdrop-blur-xl border border-primary/20 p-6 md:p-8 rounded-3xl shadow-2xl max-w-5xl mx-auto -mt-24 relative z-30">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
        {/* Quick Search */}
        <div className="w-full md:w-1/3">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/60 mb-2">Quick Search</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Honda HR-V 2023" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/20 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Brand Filter */}
        <div className="w-full md:w-1/5">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/60 mb-2">Brand</label>
          <div className="relative">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/20 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Price Filter */}
        <div className="w-full md:w-1/5">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/60 mb-2">Max Price</label>
          <div className="relative">
            <select 
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/20 rounded-xl py-3 px-4 text-sm appearance-none focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Any Price</option>
              <option value="50000">$50,000</option>
              <option value="100000">$100,000</option>
              <option value="200000">$200,000</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full md:w-auto md:flex-grow">
          <button 
            type="submit" 
            className="w-full bg-primary text-background font-bold uppercase tracking-widest text-xs py-4 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <SlidersHorizontal size={16} />
            <span>Search Vehicles</span>
          </button>
        </div>
      </form>
    </div>
  );
}
