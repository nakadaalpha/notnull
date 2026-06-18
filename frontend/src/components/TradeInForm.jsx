import React from 'react';
import { CarFront } from 'lucide-react';

export default function TradeInForm({
  tradeInBrand, setTradeInBrand,
  tradeInYear, setTradeInYear,
  tradeInValue, isEstimating,
  handleTradeInEstimate
}) {
  return (
    <div className="border border-primary/10 rounded-xl p-8">
      <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center">
        <CarFront size={18} className="mr-3 text-primary/70" />
        Trade-In Valuation
      </h3>
      <p className="text-xs text-primary/50 tracking-wide mb-6 leading-relaxed">
        Get an instant estimated value for your current vehicle to apply towards this purchase.
      </p>
      <form onSubmit={handleTradeInEstimate} className="flex flex-col gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-2">Current Brand</label>
          <input 
            type="text" 
            value={tradeInBrand}
            onChange={(e) => setTradeInBrand(e.target.value)}
            placeholder="e.g. BMW, Audi..." 
            className="w-full p-3 bg-transparent border border-primary/20 text-sm focus:outline-none focus:border-primary rounded-md"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-primary/50 mb-2">Year</label>
          <select 
            value={tradeInYear}
            onChange={(e) => setTradeInYear(e.target.value)}
            className="w-full p-3 bg-transparent border border-primary/20 text-sm focus:outline-none focus:border-primary appearance-none rounded-md"
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
          className="w-full mt-2 px-8 py-3 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 rounded-md"
        >
          {isEstimating ? 'Calculating...' : 'Get Estimate'}
        </button>
      </form>
      {tradeInValue > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-md flex justify-between items-center animate-in fade-in">
          <span className="text-xs font-bold tracking-widest uppercase">Value:</span>
          <span className="text-lg font-light">-${tradeInValue.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
