import React from 'react';
import { X, CreditCard } from 'lucide-react';

export default function ReservationModal({
  isModalOpen, setIsModalOpen, car,
  inspectionDate, setInspectionDate,
  cardNumber, setCardNumber,
  expiry, setExpiry,
  cvv, setCvv,
  handleReservationSubmit,
  isSubmitting, submitMessage
}) {
  if (!isModalOpen || !car) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-primary/20 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
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
          <div className="mt-8 flex items-center text-[10px] tracking-widest uppercase text-primary/40">
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
                  className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
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
                    className="w-full bg-transparent border border-primary/20 p-3 pl-10 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
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
                  className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
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
                  className="w-full bg-transparent border border-primary/20 p-3 text-sm font-light focus:outline-none focus:border-primary transition-colors rounded-md"
                />
              </div>
            </div>

            {submitMessage && (
              <p className={`text-[10px] tracking-widest uppercase font-bold text-center ${submitMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                {submitMessage}
              </p>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors disabled:opacity-50 mt-4 rounded-md"
            >
              {isSubmitting ? 'Processing...' : 'Pay $500 & Reserve'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
