import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gauge } from 'lucide-react';
import { EngineIcon, EvIcon } from './Icons';

export default function CarCard({ car, isRecommended = false, className = '' }) {
  if (!car) return null;

  return (
    <div className={`group cursor-pointer h-full ${className}`}>
      <Link to={`/car/${car.id}`} className="block h-full relative">
        {isRecommended && (
          <div className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-md border border-primary/20 px-3 py-1.5 flex items-center space-x-2 shadow-xl">
            <Sparkles size={12} className="text-primary/80" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">For You</span>
          </div>
        )}
        <div className="bg-background overflow-hidden h-full flex flex-col transition-all duration-500 border border-transparent hover:border-primary/10 group-hover:shadow-2xl">
          <div className="aspect-[4/3] md:aspect-[16/10] bg-white p-8 flex items-center justify-center overflow-hidden relative">
            <img 
              src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
              alt={car.model}
              className="w-full h-full object-contain relative z-0 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Premium+Vehicle'; }}
            />
          </div>
          <div className="pt-6 pb-4 px-2 md:px-4 flex-grow flex flex-col justify-between relative bg-background border-b border-primary/5 group-hover:border-primary/30 transition-colors duration-500">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-primary/70 text-[10px] font-bold tracking-[0.2em] uppercase">
                  {car.brand?.name}
                </p>
                {car.specifications?.performance?.engine_type && (
                  <div className="flex items-center text-primary/60">
                    {car.specifications.performance.engine_type.toLowerCase().includes('ev') || car.specifications.performance.engine_type.toLowerCase().includes('electric') ? (
                      <EvIcon size={16} className="mr-2" strokeWidth={1.5} />
                    ) : (
                      <EngineIcon size={16} className="mr-2" strokeWidth={1.5} />
                    )}
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-0.5">{car.specifications.performance.engine_type}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end pb-2">
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide leading-none">
                  {car.model}
                </h3>
                {car.specifications?.performance?.horsepower && (
                  <div className="flex items-center text-primary/60 pb-0.5 mt-2 md:mt-0">
                    <Gauge size={16} className="mr-2" strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-0.5">{car.specifications.performance.horsepower.split(' @')[0]}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-xs font-light text-primary/60 mb-1">From</p>
                <span className="font-light text-lg md:text-xl">${car.price.toLocaleString()}</span>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase hover:underline">
                EXPLORE &rsaquo;
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
