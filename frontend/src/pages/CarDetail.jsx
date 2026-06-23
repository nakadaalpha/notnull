import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import CarSpecsTabs from '../components/CarSpecsTabs';
import FinancingCalculator from '../components/FinancingCalculator';
import TradeInForm from '../components/TradeInForm';
import ReservationModal from '../components/ReservationModal';
import LoginModal from '../components/LoginModal';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Administrative Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');

  // Financing Calculator States
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [months, setMonths] = useState(60);



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

  const finalCarPrice = car ? Math.max(0, car.price) : 0;
  
  const monthlyPayment = useMemo(() => {
    if (!finalCarPrice) return 0;
    const principal = finalCarPrice - (finalCarPrice * (downPayment / 100));
    if (principal <= 0) return 0;
    const monthlyRate = (interestRate / 100) / 12;
    if (monthlyRate === 0) return principal / months;
    const payment = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
    return payment.toFixed(0);
  }, [finalCarPrice, downPayment, interestRate, months]);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !identityNumber || !inspectionDate) {
      setSubmitMessage('Please complete all administrative details.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('Generating Xendit Invoice... Redirecting to secure checkout...');
    
    if (!user) {
      setSubmitMessage('Please sign in to reserve this vehicle.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    try {
      const response = await api.post('/reservations', {
        carId: parseInt(id),
        inspectionDate,
        fullName,
        email,
        identityNumber
      });
      
      setSubmitMessage('Invoice generated! Redirecting...');
      
      // Simulate redirect to checkout URL
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitMessage('');
        setInspectionDate('');
        setFullName(''); setEmail(''); setIdentityNumber('');
        setIsSubmitting(false);
        
        // Open the Xendit mock URL in a new tab
        window.open(response.data.checkout_url, '_blank');
      }, 1500);
      
    } catch (error) {
      console.error("Failed to book inspection", error);
      setSubmitMessage('Failed to connect to Payment Gateway. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePurchase = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/checkout?carId=${car.id}`);
  };

  const handleTradeInCheckout = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/checkout?carId=${car.id}&tradeIn=true`);
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

  return (
    <div className="min-h-screen pt-32 pb-32 max-w-[1600px] mx-auto px-6 md:px-12 bg-background">
      <Link to="/warehouse" className="inline-flex items-center space-x-4 mb-10 group hover:opacity-60 transition-opacity">
        <ArrowLeft size={20} strokeWidth={1} className="transform group-hover:-translate-x-2 transition-transform" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase">Back to Collection</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Side: Content Heavy (Image, Specs, Calculators) */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* Hero Image - Fixed Aspect Ratio */}
          <div className="bg-white aspect-[4/3] md:aspect-[16/9] flex items-center justify-center relative overflow-hidden rounded-xl">
            <img 
              src={car.imageUrl ? `/images/cars/${car.imageUrl}` : `/images/cars/default.png`} 
              alt={car.model}
              className="w-full h-full object-contain p-4 md:p-8 relative z-10 hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x500?text=Premium+Vehicle'; }}
            />
          </div>

          {/* Dynamic Specifications Tabbed Interface */}
          <CarSpecsTabs 
            specs={specs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* Financing Calculator */}
            <FinancingCalculator 
              downPayment={downPayment} setDownPayment={setDownPayment}
              interestRate={interestRate} setInterestRate={setInterestRate}
              months={months} setMonths={setMonths}
              monthlyPayment={monthlyPayment}
            />

            {/* Trade-In Promotional Card */}
            <TradeInForm onTradeInCheckout={handleTradeInCheckout} />
          </div>
        </div>

        {/* Right Side: Sticky Conversion Column */}
        <div className="w-full lg:w-1/3 flex flex-col lg:sticky lg:top-32 space-y-8">
          
          <div className="bg-secondary/5 dark:bg-white/5 border border-primary/10 rounded-xl p-8 md:p-10">
            <div className="mb-6 flex justify-between items-start">
              <span className={`px-4 py-1.5 border rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                car.stock > 0 ? 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/5' : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5'
              }`}>
                {car.stock > 0 ? `${car.stock} In Stock` : 'Out of Stock'}
              </span>
            </div>
            
            <h4 className="text-primary/50 text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-2">
              {car.brand?.name}
            </h4>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
              {car.model}
            </h1>

            {/* Hero Specs Badges */}
            {specs?.hero_specs ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {Object.entries(specs.hero_specs).map(([key, val]) => (
                  <span key={key} className="px-3 py-1 bg-background border border-primary/10 rounded-md text-[10px] tracking-widest uppercase font-bold text-primary/70">
                    {val}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-primary/80 font-light mb-8 uppercase tracking-widest">Model Year {car.yearMade}</p>
            )}

            <div className="space-y-4 mb-8 py-6 border-y border-primary/10">
              <div className="flex items-center space-x-3 text-sm font-light">
                <CheckCircle2 strokeWidth={1} className="text-primary/60 shrink-0" size={18} />
                <span>5-Year Manufacturer Warranty</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-light">
                <CheckCircle2 strokeWidth={1} className="text-primary/60 shrink-0" size={18} />
                <span>Complimentary VIP Maintenance</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-light">
                <CheckCircle2 strokeWidth={1} className="text-primary/60 shrink-0" size={18} />
                <span>Free Global Delivery</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50 mb-1">Net Purchase Price</p>
                <p className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  ${finalCarPrice.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                disabled={car.stock <= 0 || isPurchasing}
                onClick={handlePurchase}
                className={`w-full py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-md flex items-center justify-center space-x-2 ${
                  car.stock > 0 
                  ? 'bg-foreground text-background hover:bg-primary hover:text-background' 
                  : 'bg-primary/5 text-primary/30 cursor-not-allowed border border-primary/10'
                }`}
              >
                {isPurchasing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  car.stock > 0 ? 'Purchase Vehicle' : 'Out of Stock'
                )}
              </button>
              
              <button 
                onClick={() => {
                  if (user) {
                    setIsModalOpen(true);
                  } else {
                    navigate('/login');
                  }
                }}
                className="w-full py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 bg-transparent border border-primary/20 text-foreground hover:bg-primary/5 rounded-md flex items-center justify-center space-x-2"
              >
                <span>Book Inspection</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Reservation & Secure Payment Modal */}
      <ReservationModal 
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} car={car}
        inspectionDate={inspectionDate} setInspectionDate={setInspectionDate}
        fullName={fullName} setFullName={setFullName}
        email={email} setEmail={setEmail}
        identityNumber={identityNumber} setIdentityNumber={setIdentityNumber}
        handleReservationSubmit={handleReservationSubmit}
        isSubmitting={isSubmitting} submitMessage={submitMessage}
      />

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
