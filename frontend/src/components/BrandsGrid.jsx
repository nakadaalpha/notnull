import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const BrandsGrid = forwardRef(({ brands = [] }, ref) => {
  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 mb-20 bg-secondary/10 dark:bg-black/20 border-y border-primary/5">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/50 mb-2">Partner Manufacturers</h2>
        <h3 className="text-3xl md:text-5xl font-light tracking-widest uppercase">
          World-Class <span className="font-bold">Engineering</span>
        </h3>
      </div>
      
      <div ref={ref} className="flex flex-wrap justify-center gap-x-8 gap-y-12 md:gap-x-12 lg:gap-x-16">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <Link to={`/warehouse?brand=${brand.id}`} key={brand.id} className="block group w-[40%] md:w-[25%] lg:w-[15%]">
              <div className="h-40 flex flex-col items-center justify-center transition-all duration-500">
                <img loading="lazy" 
                  src={brand.imageUrl ? `/images/brands/${brand.imageUrl}` : `/images/brands/${brand.name.toLowerCase()}.png`} 
                  alt={brand.name}
                  className="max-h-24 max-w-[160px] object-contain opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 filter dark:invert"
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
  );
});

export default BrandsGrid;
