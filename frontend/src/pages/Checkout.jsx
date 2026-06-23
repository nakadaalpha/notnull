import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ShieldCheck, Car, RefreshCcw } from 'lucide-react';
import api from '../api';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const carId = searchParams.get('carId');
  const isTradeIn = searchParams.get('tradeIn') === 'true';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Trade-In Form State
  const [tradeInForm, setTradeInForm] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    notes: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchDetails = async () => {
      try {
        const response = await api.get('/cars');
        const found = response.data.find(c => c.id === parseInt(carId));
        if (!found) navigate('/warehouse');
        setCar(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [carId, user, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let tradeInId = null;
      
      // If trade-in is selected, submit trade-in first
      if (isTradeIn) {
        const tradeRes = await api.post('/trade-in', {
          ...tradeInForm,
          customerId: user.id
        });
        tradeInId = tradeRes.data.id;
      }

      // Proceed to checkout
      const checkoutRes = await api.post('/transactions/checkout', {
        carId: car.id,
        customerId: user.id,
        tradeInId: tradeInId
      });

      // Redirect to mock Xendit URL
      window.location.href = checkoutRes.data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert('Failed to process checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center text-xs tracking-widest uppercase">Loading checkout...</div>;
  if (!car) return <div className="min-h-screen pt-32 flex justify-center text-xs tracking-widest uppercase text-red-500">Vehicle not found.</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background text-foreground">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-4 mb-8 text-xs font-bold tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Forms */}
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-secondary/5 border border-primary/10 p-8 rounded-2xl">
              <h2 className="text-sm font-bold tracking-widest uppercase mb-6 flex items-center">
                <ShieldCheck className="mr-3 text-primary/50" />
                Billing Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Full Name</label>
                  <input type="text" readOnly value={user?.username || ''} className="w-full bg-background border border-primary/20 rounded-md p-3 text-sm opacity-70 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Email Address</label>
                  <input type="email" readOnly value={user?.email || ''} className="w-full bg-background border border-primary/20 rounded-md p-3 text-sm opacity-70 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {isTradeIn && (
              <div className="bg-secondary/5 border border-primary/10 p-8 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-sm font-bold tracking-widest uppercase mb-6 flex items-center">
                  <RefreshCcw className="mr-3 text-primary/50" />
                  Trade-In Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">License Plate</label>
                    <input type="text" required placeholder="e.g. B 1234 XYZ" value={tradeInForm.licensePlate} onChange={e => setTradeInForm({...tradeInForm, licensePlate: e.target.value})} className="w-full bg-background border border-primary/20 focus:border-primary rounded-md p-3 text-sm outline-none transition-colors uppercase" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Brand</label>
                    <input type="text" required placeholder="e.g. BMW" value={tradeInForm.brand} onChange={e => setTradeInForm({...tradeInForm, brand: e.target.value})} className="w-full bg-background border border-primary/20 focus:border-primary rounded-md p-3 text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Model</label>
                    <input type="text" required placeholder="e.g. 320i M Sport" value={tradeInForm.model} onChange={e => setTradeInForm({...tradeInForm, model: e.target.value})} className="w-full bg-background border border-primary/20 focus:border-primary rounded-md p-3 text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Year</label>
                    <input type="number" required min="2000" max="2026" value={tradeInForm.year} onChange={e => setTradeInForm({...tradeInForm, year: parseInt(e.target.value)})} className="w-full bg-background border border-primary/20 focus:border-primary rounded-md p-3 text-sm outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-primary/50 mb-2">Additional Notes</label>
                    <textarea placeholder="Condition, modifications, etc." value={tradeInForm.notes} onChange={e => setTradeInForm({...tradeInForm, notes: e.target.value})} className="w-full bg-background border border-primary/20 focus:border-primary rounded-md p-3 text-sm outline-none transition-colors min-h-[100px]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-secondary/10 border border-primary/10 p-8 rounded-2xl sticky top-32">
              <h3 className="text-xs font-bold tracking-widest uppercase text-primary/50 mb-6">Order Summary</h3>
              
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-primary/10">
                <div className="w-16 h-12 bg-white rounded-md flex items-center justify-center p-1">
                  <img src={car.imageUrl ? `/images/cars/${car.imageUrl}` : '/images/cars/default.png'} alt={car.model} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">{car.brand?.name}</p>
                  <p className="font-bold">{car.model}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-primary/70">Vehicle Base Price</span>
                  <span>${car.price.toLocaleString()}</span>
                </div>
                {isTradeIn && (
                  <div className="flex justify-between text-orange-500">
                    <span>Est. Trade-In Deduction</span>
                    <span>TBD by Mechanic</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-primary/70">Taxes & Fees</span>
                  <span>Calculated later</span>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Booking Fee</span>
                  <span className="text-2xl font-light">$5,000</span>
                </div>
                <p className="text-[10px] text-primary/40 uppercase tracking-widest">Fully refundable if transaction is cancelled</p>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing || (isTradeIn && (!tradeInForm.licensePlate || !tradeInForm.brand || !tradeInForm.model))}
                className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay Booking Fee'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
