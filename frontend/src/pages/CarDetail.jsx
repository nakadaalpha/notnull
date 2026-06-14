import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, X, Calculator, CreditCard, CarFront, ChevronRight } from 'lucide-react';
import api from '../api';

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Specifications UI State
  const [activeTab, setActiveTab] = useState('performance');

  // AI Personalization Tracking
  useEffect(() => {
    if (car && car.brand) {
      try {
        const tracked = JSON.parse(localStorage.getItem('trackedBrands') || '[]');
        if (!tracked.includes(car.brand.name)) {
          tracked.push(car.brand.name);
          localStorage.setItem('trackedBrands', JSON.stringify(tracked));
        }
      } catch (e) {}
    }
  }, [car]);

  // Reservation & Payment Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectionDate, setInspectionDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Payment Mock States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Financing Calculator States
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [months, setMonths] = useState(60);

  // Trade-In States
  const [tradeInBrand, setTradeInBrand] = useState('');
  const [tradeInYear, setTradeInYear] = useState('2020');
  const [tradeInValue, setTradeInValue] = useState(0);
  const [isEstimating, setIsEstimating] = useState(false);

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

  // Derived Calculations
  const finalCarPrice = car ? Math.max(0, car.price - tradeInValue) : 0;
  
  const monthlyPayment = useMemo(() => {
    if (!finalCarPrice) return 0;
    const principal = finalCarPrice - (finalCarPrice * (downPayment / 100));
    if (principal <= 0) return 0;
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) return principal / months;
    const payment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    return payment.toFixed(0);
  }, [finalCarPrice, downPayment, interestRate, months]);

  const handleTradeInEstimate = (e) => {
    e.preventDefault();
    if (!tradeInBrand) return;
    setIsEstimating(true);
    setTimeout(() => {
      const baseValue = tradeInYear > 2018 ? 25000 : 15000;
      const brandMultiplier = tradeInBrand.length > 5 ? 1.2 : 0.9;
      setTradeInValue(Math.floor(baseValue * brandMultiplier));
      setIsEstimating(false);
    }, 1500);
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      setSubmitMessage('Please complete the payment details.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('Processing secure payment via Mock Stripe...');
    
    setTimeout(async () => {
      try {
        await api.post('/reservations', {
          customerId: 1,
          carId: parseInt(id),
          inspectionDate,
          notes
        });
        setSubmitMessage('Payment successful! Reservation confirmed.');
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitMessage('');
          setInspectionDate('');
          setNotes('');
          setCardNumber(''); setExpiry(''); setCvv('');
        }, 3000);
      } catch (error) {
        console.error("Failed to book inspection", error);
        setSubmitMessage('Failed to process. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 2000);
  };

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
        <span className="text-sm font-light tracking-widest uppercase text-red-500">Vehicle not found.</span>
      </div>
    );
  }

  const specs = car.specifications || {};

  const renderObjList = (obj) => {
    if (!obj) return null;
    return (
      <ul className="space-y-4">
        {Object.entries(obj).map(([key, value]) => (
          <li key={key} className="flex flex-col md:flex-row md:items-center py-3 border-b border-primary/5">
            <span className="text-xs uppercase tracking-widest text-primary/50 md:w-1/3 mb-1 md:mb-0">
              {key.replace(/_/g, ' ')}
            </span>
            <span className="text-sm font-light md:w-2/3">{value}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderArrayLists = (obj) => {
    if (!obj) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(obj).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-primary/70">{category.replace(/_/g, ' ')}</h4>
            <ul className="space-y-2">
              {Array.isArray(items) && items.map((item, i) => (
                <li key={i} className="flex items-start text-sm font-light">
                  <CheckCircle2 size={16} className="text-primary/40 mr-3 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-32 max-w-[1600px] mx-auto px-6 md:px-12 bg-background">
      <Link to="/warehouse" className="inline-flex items-center space-x-4 mb-16 group hover:opacity-60 transition-opacity">
        <ArrowLeft size={20} strokeWidth={1} className="transform group-hover:-translate-x-2 transition-transform" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase">Back to Collection</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left Side: Massive Image & Specs */}
        <div className="w-full lg:w-3/5 space-y-12">
          {/* Hero Image */}
          <div className="bg-secondary/10 dark:bg-white/5 p-12 md:p-24 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
            <img 
              src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
              alt={car.model}
              className="w-full h-auto object-contain max-h-[600px] relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=Premium+Vehicle'; }}
            />
          </div>

          {/* Dynamic Specifications Tabbed Interface */}
          {specs && Object.keys(specs).length > 0 && (
            <div className="border border-primary/10">
              <div className="flex overflow-x-auto border-b border-primary/10 scrollbar-hide">
                {['performance', 'dimensions', 'interior', 'safety_and_features'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                      activeTab === tab 
                        ? 'bg-primary text-background' 
                        : 'text-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {tab.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              
              <div className="p-8 md:p-12 min-h-[300px]">
                {activeTab === 'performance' && renderObjList(specs.performance)}
                {activeTab === 'dimensions' && renderObjList(specs.dimensions)}
                {activeTab === 'interior' && renderArrayLists(specs.interior)}
                {activeTab === 'safety_and_features' && renderArrayLists(specs.safety_and_features)}
              </div>
            </div>
          )}

          {/* Trade-In Valuation Form */}
          <div className="border border-primary/20 p-8">
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center">
              <CarFront size={18} className="mr-3 text-primary/70" />
              Trade-In Valuation
            </h3>
            <form onSubmit={handleTradeInEstimate} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full">
                <label className="block text-xs uppercase tracking-widest text-primary/50 mb-2">Current Car Brand</label>
                <input 
                  type="text" 
                  value={tradeInBrand}
                  onChange={(e) => setTradeInBrand(e.target.value)}
                  placeholder="e.g. BMW, Audi..." 
                  className="w-full p-3 bg-transparent border border-primary/20 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="w-full md:w-1/3">
                <label className="block text-xs uppercase tracking-widest text-primary/50 mb-2">Year</label>
                <select 
                  value={tradeInYear}
                  onChange={(e) => setTradeInYear(e.target.value)}
                  className="w-full p-3 bg-transparent border border-primary/20 text-sm focus:outline-none focus:border-primary appearance-none"
                >
                  <option className="dark:bg-black">2023</option>
                  <option className="dark:bg-black">2022</option>
                  <option className="dark:bg-black">2021</option>
                  <option className="dark:bg-black">2020</option>
                  <option className="dark:bg-black">2019</option>
                  <option className="dark:bg-black">2018</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={isEstimating || !tradeInBrand}
                className="w-full md:w-auto px-8 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isEstimating ? 'Calculating...' : 'Get Estimate'}
              </button>
            </form>
            {tradeInValue > 0 && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 flex justify-between items-center animate-in fade-in">
                <span className="text-sm font-bold tracking-widest uppercase">Estimated Value:</span>
                <span className="text-xl font-light">-${tradeInValue.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Elegant Details */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <span className={`px-4 py-1.5 border text-[10px] font-bold uppercase tracking-[0.2em] ${
              car.stock > 0 ? 'border-green-500/30 text-green-600 dark:text-green-400' : 'border-red-500/30 text-red-600 dark:text-red-400'
            }`}>
              {car.stock > 0 ? `${car.stock} In Stock` : 'Out of Stock'}
            </span>
          </div>
          
          <h4 className="text-primary/50 text-sm font-bold tracking-[0.3em] uppercase mb-2">
            {car.brand?.name}
          </h4>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">
            {car.model}
          </h1>

          {/* Hero Specs Badges */}
          {specs?.hero_specs ? (
            <div className="flex flex-wrap gap-3 mb-10">
              {Object.entries(specs.hero_specs).map(([key, val]) => (
                <span key={key} className="px-3 py-1 bg-primary/5 border border-primary/10 text-xs tracking-widest uppercase font-bold text-primary/70">
                  {val}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xl text-primary/80 font-light mb-10">Model Year {car.yearMade}</p>
          )}

          <div className="space-y-6 mb-12 border-y border-primary/10 py-10">
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">5-Year Manufacturer Warranty</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">Complimentary VIP Maintenance</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle2 strokeWidth={1} className="text-primary/60" size={24} />
              <span className="text-lg font-light tracking-wide">Free Global Delivery</span>
            </div>
          </div>

          {/* Financing Calculator */}
          <div className="border border-primary/20 p-8 mb-12">
            <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 flex items-center">
              <Calculator size={18} className="mr-3 text-primary/70" />
              Financing Calculator
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs tracking-widest uppercase text-primary/60 mb-2">
                  <span>Down Payment</span>
                  <span>{downPayment}%</span>
                </div>
                <input type="range" min="0" max="50" step="5" value={downPayment} onChange={(e)=>setDownPayment(e.target.value)} className="w-full accent-primary" />
              </div>
              <div>
                <div className="flex justify-between text-xs tracking-widest uppercase text-primary/60 mb-2">
                  <span>Interest (APR)</span>
                  <span>{interestRate}%</span>
                </div>
                <input type="range" min="0" max="15" step="0.5" value={interestRate} onChange={(e)=>setInterestRate(e.target.value)} className="w-full accent-primary" />
              </div>
              <div>
                <div className="flex justify-between text-xs tracking-widest uppercase text-primary/60 mb-2">
                  <span>Term</span>
                  <span>{months} Mo</span>
                </div>
                <input type="range" min="12" max="84" step="12" value={months} onChange={(e)=>setMonths(e.target.value)} className="w-full accent-primary" />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col items-center text-center">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary/50 mb-2">Estimated Monthly</p>
              <p className="text-4xl font-light tracking-tight">${Number(monthlyPayment).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-auto mb-8">
            <div className="mb-6">
              {tradeInValue > 0 && (
                <div className="flex justify-between items-end mb-2 text-primary/50 line-through">
                  <span className="text-xs uppercase tracking-widest">Original MSRP</span>
                  <span className="text-xl">${car.price.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-end">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary/50 mb-2">Net Purchase Price</p>
                <p className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                  ${finalCarPrice.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col xl:flex-row gap-4">
              <button 
                disabled={car.stock <= 0}
                className={`flex-1 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 text-center ${
                  car.stock > 0 
                  ? 'bg-foreground text-background hover:bg-primary hover:text-background' 
                  : 'bg-primary/5 text-primary/30 cursor-not-allowed border border-primary/10'
                }`}
              >
                {car.stock > 0 ? 'Purchase Vehicle' : 'Out of Stock'}
              </button>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent border border-primary/20 text-foreground hover:bg-primary/5 flex items-center justify-center space-x-3"
          >
            <span>Book Inspection / Test Drive</span>
          </button>
        </div>
      </div>

      {/* Reservation & Secure Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-background border border-primary/20 w-full max-w-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Info Panel */}
            <div className="w-full md:w-2/5 bg-secondary/10 dark:bg-white/5 p-8 border-b md:border-b-0 md:border-r border-primary/10 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Secure Booking</h3>
                <p className="text-xs font-light text-primary/60 tracking-wide mb-8">
                  A fully refundable $500 holding deposit is required to reserve the vehicle for inspection.
                </p>
                
                <div className="space-y-4 text-sm font-light">
                  <div className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-primary/60">Vehicle</span>
                    <span className="font-medium text-right">{car.brand?.name} {car.model}</span>
                  </div>
                  <div className="flex justify-between border-b border-primary/10 pb-2">
                    <span className="text-primary/60">Deposit Fee</span>
                    <span className="font-medium">$500.00</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center text-xs tracking-widest uppercase text-primary/40">
                <CreditCard size={14} className="mr-2" />
                SSL Encrypted Payment
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full md:w-3/5 p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-primary/50 hover:text-primary">
                <X size={20} strokeWidth={1} />
              </button>
              
              <form onSubmit={handleReservationSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Preferred Date & Time</label>
                    <input 
                      type="datetime-local" 
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        className="w-full bg-transparent border border-primary/20 p-3 pl-10 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                      />
                      <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">Expiry Date</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 mb-2">CVV</label>
                    <input 
                      type="password" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="***"
                      maxLength="4"
                      className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {submitMessage && (
                  <p className={`text-xs tracking-widest uppercase font-bold text-center ${submitMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                    {submitMessage}
                  </p>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Processing Payment...' : 'Pay $500 & Reserve'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
