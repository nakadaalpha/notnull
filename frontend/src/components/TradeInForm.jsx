import React from 'react';
import { CarFront, ArrowRight } from 'lucide-react';

export default function TradeInForm({ onTradeInCheckout }) {
  return (
    <div className="border border-primary/10 rounded-xl p-8 flex flex-col justify-between h-full bg-secondary/5">
      <div>
        <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center">
          <CarFront size={18} className="mr-3 text-primary/70" />
          Trade-In Program
        </h3>
        <p className="text-sm text-primary/60 tracking-wide mb-4 leading-relaxed font-light">
          Would you like to trade in your current vehicle to offset the cost of this purchase?
        </p>
        <p className="text-xs text-primary/50 tracking-wide mb-8 leading-relaxed">
          Our mechanics will inspect your car and provide a competitive appraisal to be deducted from your final bill.
        </p>
      </div>
      
      <button 
        onClick={onTradeInCheckout}
        className="w-full px-8 py-4 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors rounded-md flex items-center justify-center space-x-3"
      >
        <span>Apply for Trade-In</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
