import React from 'react';
import { Calculator } from 'lucide-react';

export default function FinancingCalculator({
  downPayment, setDownPayment,
  interestRate, setInterestRate,
  months, setMonths,
  monthlyPayment
}) {
  return (
    <div className="border border-primary/10 rounded-xl p-8 bg-secondary/5 dark:bg-white/5">
      <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 flex items-center">
        <Calculator size={18} className="mr-3 text-primary/70" />
        Financing Calculator
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-[10px] md:text-xs tracking-widest uppercase text-primary/60 mb-2">
            <span>Down Payment</span>
            <span>{downPayment}%</span>
          </div>
          <input type="range" min="0" max="50" step="5" value={downPayment} onChange={(e)=>setDownPayment(e.target.value)} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] md:text-xs tracking-widest uppercase text-primary/60 mb-2">
            <span>Interest (APR)</span>
            <span>{interestRate}%</span>
          </div>
          <input type="range" min="0" max="15" step="0.5" value={interestRate} onChange={(e)=>setInterestRate(e.target.value)} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] md:text-xs tracking-widest uppercase text-primary/60 mb-2">
            <span>Term</span>
            <span>{months} Mo</span>
          </div>
          <input type="range" min="12" max="84" step="12" value={months} onChange={(e)=>setMonths(e.target.value)} className="w-full accent-primary" />
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50 mb-2">Estimated Monthly</p>
        <p className="text-3xl md:text-4xl font-light tracking-tight">${Number(monthlyPayment).toLocaleString()}</p>
        <p className="text-[10px] text-primary/40 uppercase tracking-widest mt-2">Excludes taxes and fees.</p>
      </div>
    </div>
  );
}
