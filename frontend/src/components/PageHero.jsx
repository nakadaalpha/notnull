import React, { forwardRef } from 'react';

const PageHero = forwardRef(({ 
  imageUrl, 
  title, 
  subtitleHighlight = '', 
  subtitle = '', 
  pretext = '', 
  heightClass = 'h-screen', 
  overlayClass = 'bg-black/20',
  titleLayout = 'bottom'
}, ref) => {
  return (
    <section className={`w-full relative ${heightClass} overflow-hidden`} ref={ref}>
      <div className={`absolute inset-0 z-10 ${overlayClass}`}></div>
      <img 
        src={imageUrl} 
        alt="Hero" 
        className="w-full h-full object-cover transform scale-105" 
      />
      
      {titleLayout === 'bottom' ? (
        <div className="absolute bottom-12 left-6 md:left-12 z-20">
          {pretext && <p className="text-white/60 text-xs font-bold tracking-[0.4em] uppercase mb-4">{pretext}</p>}
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl">
            {title} <br/> <span className="text-white/70 font-light">{subtitle}</span>
          </h1>
        </div>
      ) : (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
          {pretext && <p className="text-white/60 text-xs font-bold tracking-[0.4em] uppercase mb-4">{pretext}</p>}
          <h1 className="text-white text-4xl md:text-6xl font-light tracking-[0.1em] uppercase">
            {title} <span className="font-bold">{subtitleHighlight}</span>
          </h1>
        </div>
      )}
    </section>
  );
});

export default PageHero;
