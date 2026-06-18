import React from 'react';

export default function BrandMarquee({ brands = [], selectedBrand = '', setSelectedBrand = () => {} }) {
  if (!brands || brands.length === 0) return null;
  
  return (
    <div className="w-full border-y border-primary/10 mb-16 overflow-hidden relative group">
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
  );
}
