import { X, ArrowRight, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TradeInPromptModal({ isOpen, onClose, carId }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-secondary/5 border border-primary/20 rounded-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-background rounded-full hover:bg-primary/10 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCcw size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Trade-In Vehicle?</h2>
          <p className="text-sm text-primary/60 font-light">
            Would you like to trade in your current vehicle to offset the cost of this purchase? 
            Our mechanic will inspect your car and provide a competitive appraisal.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate(`/checkout?carId=${carId}&tradeIn=true`)}
            className="w-full py-4 bg-foreground text-background text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary transition-colors flex items-center justify-center space-x-2"
          >
            <span>Yes, I want to Trade-In</span>
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => navigate(`/checkout?carId=${carId}`)}
            className="w-full py-4 bg-transparent border border-primary/20 text-foreground text-xs font-bold tracking-[0.2em] uppercase rounded-md hover:bg-primary/5 transition-colors"
          >
            No, proceed to checkout directly
          </button>
        </div>
      </div>
    </div>
  );
}
