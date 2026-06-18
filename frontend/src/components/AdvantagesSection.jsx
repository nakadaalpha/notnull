import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ShieldCheck, Globe, Truck, Sparkles } from 'lucide-react';

const AdvantagesSection = forwardRef((props, ref) => {
  return (
    <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 pb-32 border-b border-primary/5 overflow-hidden">
      <div ref={ref} className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left: Heading & Intro */}
        <div className="w-full lg:w-1/3 shrink-0">
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/50 mb-4 flex items-center">
            <Diamond size={14} className="mr-2" /> The NOTNULL Difference
          </h2>
          <h3 className="text-3xl md:text-5xl font-light tracking-widest uppercase leading-tight mb-8">
            Beyond <br/><span className="font-bold">Ordinary</span>
          </h3>
          <p className="text-sm font-light text-primary/70 leading-relaxed mb-10">
            We don't just sell cars; we curate automotive masterpieces. Every vehicle in our vault is meticulously inspected and verified to meet the highest global standards, ensuring an uncompromising ownership experience from pixel to pavement.
          </p>
          <Link to="/warehouse" className="inline-block border-b border-primary/30 pb-2 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors hover:border-primary">
            Explore Our Standards
          </Link>
        </div>

        {/* Right: Grid of Features */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          <div className="group">
            <ShieldCheck size={32} className="text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1} />
            <h4 className="text-sm font-bold tracking-widest uppercase mb-4">300-Point Inspection</h4>
            <p className="text-xs font-light text-primary/60 leading-relaxed">
              Our master technicians conduct rigorous multi-point mechanical and cosmetic evaluations before any vehicle enters our digital showroom.
            </p>
          </div>
          <div className="group">
            <Globe size={32} className="text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1} />
            <h4 className="text-sm font-bold tracking-widest uppercase mb-4">Global Sourcing</h4>
            <p className="text-xs font-light text-primary/60 leading-relaxed">
              Looking for a specific 1-of-1 configuration? Our extensive international network allows us to locate and acquire rare vehicles from collectors worldwide.
            </p>
          </div>
          <div className="group">
            <Truck size={32} className="text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1} />
            <h4 className="text-sm font-bold tracking-widest uppercase mb-4">White-Glove Delivery</h4>
            <p className="text-xs font-light text-primary/60 leading-relaxed">
              Enclosed, fully-insured climate-controlled transport directly to your driveway. We handle all logistics to ensure a pristine arrival.
            </p>
          </div>
          <div className="group">
            <Sparkles size={32} className="text-primary mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500" strokeWidth={1} />
            <h4 className="text-sm font-bold tracking-widest uppercase mb-4">Unrivaled Exclusivity</h4>
            <p className="text-xs font-light text-primary/60 leading-relaxed">
              Gain access to highly allocated hypercars, limited production runs, and off-market rarities you won't easily find anywhere else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AdvantagesSection;
