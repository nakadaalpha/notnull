import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await api.get('/cars');
        const found = response.data.find(c => c.id === parseInt(id));
        setCar(found);
      } catch (error) {
        console.error("Failed to fetch car details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex justify-center bg-background">
        <span className="text-sm font-light tracking-widest uppercase animate-pulse">Loading vehicle...</span>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen pt-40 flex justify-center bg-background">
        <span className="text-sm font-light tracking-widest uppercase text-red-500">Vehicle not found in the collection.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 max-w-[1600px] mx-auto px-6 md:px-12 bg-background">
      <Link to="/warehouse" className="inline-flex items-center space-x-4 mb-16 group hover:opacity-60 transition-opacity">
        <ArrowLeft size={20} strokeWidth={1} className="transform group-hover:-translate-x-2 transition-transform" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase">Back to Collection</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left Side: Massive Image Showcase */}
        <div className="w-full lg:w-3/5 bg-secondary/10 dark:bg-white/5 p-12 md:p-24 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
          
          <img 
            src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
            alt={car.model}
            className="w-full h-auto object-contain max-h-[600px] relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=Premium+Vehicle'; }}
          />
        </div>

        {/* Right Side: Elegant Details */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center">
          <div className="mb-6 flex justify-between items-start">
            <span className={`px-4 py-1.5 border text-[10px] font-bold uppercase tracking-[0.2em] ${
              car.status === 'AVAILABLE' ? 'border-green-500/30 text-green-600 dark:text-green-400' :
              car.status === 'RENTED' ? 'border-orange-500/30 text-orange-600 dark:text-orange-400' :
              'border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
              {car.status}
            </span>
          </div>
          
          <h4 className="text-primary/50 text-sm font-bold tracking-[0.3em] uppercase mb-2">
            {car.brand?.name}
          </h4>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
            {car.model}
          </h1>
          
          <p className="text-2xl text-primary/80 font-light mb-12">Model Year {car.yearMade}</p>

          <div className="space-y-6 mb-16 border-y border-primary/10 py-10">
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">Premium Insurance Included</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">Free Cancellation up to 48h</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">Unlimited Mileage</span>
            </div>
          </div>

          <div className="mt-auto flex flex-col xl:flex-row xl:items-end justify-between gap-8">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary/50 mb-2">Daily Rate</p>
              <p className="text-4xl md:text-5xl font-light tracking-tight">${car.price.toLocaleString()}</p>
            </div>
            
            <button 
              disabled={car.status !== 'AVAILABLE'}
              className={`px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 w-full xl:w-auto text-center ${
                car.status === 'AVAILABLE' 
                ? 'bg-foreground text-background hover:bg-primary hover:text-background' 
                : 'bg-primary/5 text-primary/30 cursor-not-allowed border border-primary/10'
              }`}
            >
              {car.status === 'AVAILABLE' ? 'Reserve Vehicle' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
