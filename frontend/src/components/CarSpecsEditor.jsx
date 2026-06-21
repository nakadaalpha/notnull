import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

function KeyValueEditor({ title, initialData, onChange }) {
  const [entries, setEntries] = useState(() => {
    return initialData ? Object.entries(initialData).map(([k, v]) => ({ key: k, value: v })) : [];
  });

  const notifyChange = (newEntries) => {
    const newObj = {};
    newEntries.forEach(e => {
      if (e.key.trim()) newObj[e.key] = e.value;
    });
    onChange(newObj);
  };

  const addRow = () => {
    const newEntries = [...entries, { key: '', value: '' }];
    setEntries(newEntries);
    notifyChange(newEntries);
  };

  const updateRow = (index, field, val) => {
    const newEntries = [...entries];
    newEntries[index][field] = val;
    setEntries(newEntries);
    notifyChange(newEntries);
  };

  const removeRow = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    notifyChange(newEntries);
  };

  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">{title}</h4>
      <div className="space-y-2">
        {entries.map((entry, idx) => (
          <div key={idx} className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Key (e.g. Torque)" 
              value={entry.key}
              onChange={e => updateRow(idx, 'key', e.target.value)}
              className="flex-1 bg-background border border-primary/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary font-medium"
            />
            <input 
              type="text" 
              placeholder="Value (e.g. 500Nm)" 
              value={entry.value}
              onChange={e => updateRow(idx, 'value', e.target.value)}
              className="flex-1 bg-background border border-primary/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary font-medium"
            />
            <button onClick={() => removeRow(idx)} type="button" className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addRow} className="mt-2 text-[10px] font-bold uppercase tracking-widest flex items-center text-primary/50 hover:text-primary transition-colors">
        <Plus size={14} className="mr-1" /> Add Row
      </button>
    </div>
  );
}

function CategoryArrayEditor({ title, initialData, onChange }) {
  const [categories, setCategories] = useState(() => {
    return initialData ? Object.entries(initialData).map(([cat, items]) => ({ category: cat, items: items || [] })) : [];
  });

  const notifyChange = (newCats) => {
    const newObj = {};
    newCats.forEach(c => {
      if (c.category.trim()) newObj[c.category] = c.items.filter(i => i.trim() !== '');
    });
    onChange(newObj);
  };

  const addCategory = () => {
    const newCats = [...categories, { category: '', items: [''] }];
    setCategories(newCats);
    notifyChange(newCats);
  };

  const updateCategoryName = (index, name) => {
    const newCats = [...categories];
    newCats[index].category = name;
    setCategories(newCats);
    notifyChange(newCats);
  };

  const removeCategory = (index) => {
    const newCats = categories.filter((_, i) => i !== index);
    setCategories(newCats);
    notifyChange(newCats);
  };

  const addItem = (catIndex) => {
    const newCats = [...categories];
    newCats[catIndex].items.push('');
    setCategories(newCats);
    notifyChange(newCats);
  };

  const updateItem = (catIndex, itemIndex, val) => {
    const newCats = [...categories];
    newCats[catIndex].items[itemIndex] = val;
    setCategories(newCats);
    notifyChange(newCats);
  };

  const removeItem = (catIndex, itemIndex) => {
    const newCats = [...categories];
    newCats[catIndex].items = newCats[catIndex].items.filter((_, i) => i !== itemIndex);
    setCategories(newCats);
    notifyChange(newCats);
  };

  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70 mb-3">{title}</h4>
      <div className="space-y-4">
        {categories.map((cat, cIdx) => (
          <div key={cIdx} className="p-4 border border-primary/10 rounded-lg bg-secondary/30">
            <div className="flex space-x-2 mb-3">
              <input 
                type="text" 
                placeholder="Category (e.g. Seating)" 
                value={cat.category}
                onChange={e => updateCategoryName(cIdx, e.target.value)}
                className="flex-1 bg-background border border-primary/20 px-3 py-2 rounded font-bold text-sm focus:outline-none focus:border-primary uppercase tracking-widest"
              />
              <button onClick={() => removeCategory(cIdx)} type="button" className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="pl-4 space-y-2 border-l border-primary/10">
              {cat.items.map((item, iIdx) => (
                <div key={iIdx} className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Feature..." 
                    value={item}
                    onChange={e => updateItem(cIdx, iIdx, e.target.value)}
                    className="flex-1 bg-background border border-primary/20 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-primary font-medium"
                  />
                  <button onClick={() => removeItem(cIdx, iIdx)} type="button" className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addItem(cIdx)} className="mt-2 text-[10px] font-bold uppercase tracking-widest flex items-center text-primary/50 hover:text-primary transition-colors">
                <Plus size={12} className="mr-1" /> Add Feature
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addCategory} className="mt-3 text-[10px] font-bold uppercase tracking-widest flex items-center text-primary/50 hover:text-primary transition-colors">
        <Plus size={14} className="mr-1" /> Add Category
      </button>
    </div>
  );
}

export default function CarSpecsEditor({ specs, onChange }) {
  const handleUpdate = (section, newData) => {
    onChange({ ...specs, [section]: newData });
  };

  return (
    <div className="space-y-8 bg-secondary/10 p-6 rounded-xl border border-primary/5 max-h-[60vh] overflow-y-auto" data-lenis-prevent="true">
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1">Hero Badges</h3>
        <p className="text-xs text-primary/50 mb-4 font-medium">Short highlights shown under title (e.g. 0-60: "3.2s").</p>
        <KeyValueEditor title="Highlights" initialData={specs?.hero_specs} onChange={(d) => handleUpdate('hero_specs', d)} />
      </div>

      <div className="border-t border-primary/10 pt-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Performance</h3>
        <KeyValueEditor title="Engine & Drivetrain" initialData={specs?.performance} onChange={(d) => handleUpdate('performance', d)} />
      </div>

      <div className="border-t border-primary/10 pt-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Dimensions</h3>
        <KeyValueEditor title="Exterior & Capacity" initialData={specs?.dimensions} onChange={(d) => handleUpdate('dimensions', d)} />
      </div>

      <div className="border-t border-primary/10 pt-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Interior</h3>
        <CategoryArrayEditor title="Comfort & Tech" initialData={specs?.interior} onChange={(d) => handleUpdate('interior', d)} />
      </div>

      <div className="border-t border-primary/10 pt-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4">Safety & Features</h3>
        <CategoryArrayEditor title="Active & Passive Safety" initialData={specs?.safety_and_features} onChange={(d) => handleUpdate('safety_and_features', d)} />
      </div>
    </div>
  );
}
