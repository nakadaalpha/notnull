import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function CarSpecsTabs({ specs, activeTab, setActiveTab }) {
  if (!specs || Object.keys(specs).length === 0) return null;

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
    <div className="border border-primary/10 rounded-xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-primary/10 scrollbar-hide bg-secondary/5 dark:bg-white/5">
        {['performance', 'dimensions', 'interior', 'safety_and_features'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-5 text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors flex-1 ${
              activeTab === tab 
                ? 'bg-primary text-background' 
                : 'text-primary/50 hover:bg-primary/5 hover:text-primary'
            }`}
          >
            {tab.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
      
      <div className="p-8 md:p-12 min-h-[300px] bg-background">
        {activeTab === 'performance' && renderObjList(specs.performance)}
        {activeTab === 'dimensions' && renderObjList(specs.dimensions)}
        {activeTab === 'interior' && renderArrayLists(specs.interior)}
        {activeTab === 'safety_and_features' && renderArrayLists(specs.safety_and_features)}
      </div>
    </div>
  );
}
