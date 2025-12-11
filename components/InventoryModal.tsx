
import React, { useState } from 'react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: string[];
  setInventory: (items: string[]) => void;
  strictMode: boolean;
  setStrictMode: (enabled: boolean) => void;
}

const PRESETS = {
  Spirits: ['Vodka', 'Gin', 'Rum (White)', 'Rum (Dark)', 'Tequila', 'Whiskey (Bourbon)', 'Whiskey (Rye)', 'Scotch', 'Brandy', 'Vermouth (Dry)', 'Vermouth (Sweet)', 'Campari', 'Aperol', 'Cointreau/Triple Sec'],
  Mixers: ['Soda Water', 'Tonic Water', 'Cola', 'Ginger Beer', 'Ginger Ale', 'Cranberry Juice', 'Orange Juice', 'Pineapple Juice', 'Grapefruit Juice', 'Tomato Juice', 'Simple Syrup', 'Honey Syrup', 'Grenadine'],
  Fresh: ['Lemon', 'Lime', 'Orange', 'Mint', 'Basil', 'Cucumber', 'Egg White', 'Heavy Cream', 'Angostura Bitters', 'Orange Bitters']
};

export const InventoryModal: React.FC<InventoryModalProps> = ({ 
  isOpen, 
  onClose, 
  inventory, 
  setInventory, 
  strictMode, 
  setStrictMode 
}) => {
  const [customItem, setCustomItem] = useState('');

  if (!isOpen) return null;

  const toggleItem = (item: string) => {
    if (inventory.includes(item)) {
      setInventory(inventory.filter(i => i !== item));
    } else {
      setInventory([...inventory, item]);
    }
  };

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (customItem.trim() && !inventory.includes(customItem.trim())) {
      setInventory([...inventory, customItem.trim()]);
      setCustomItem('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-serif text-white">Bar Inventory</h2>
            <p className="text-slate-400 text-sm">Manage what's in your stock</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Strict Mode Toggle */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-neon-purple/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="text-neon-purple">Strict Mode</span>
              </h3>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                When enabled, AI will ONLY use ingredients from your inventory list below.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={strictMode} 
                onChange={(e) => setStrictMode(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-neon-purple"></div>
            </label>
          </div>

          {/* Categories */}
          {Object.entries(PRESETS).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-neon-blue font-bold uppercase tracking-wider text-sm mb-3 border-b border-slate-700 pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {items.map(item => {
                  const isSelected = inventory.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleItem(item)}
                      className={`px-3 py-2 rounded-lg text-sm text-left transition-all border ${
                        isSelected 
                          ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_10px_rgba(77,238,234,0.2)]' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {item} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Custom Items */}
          <div>
            <h3 className="text-neon-pink font-bold uppercase tracking-wider text-sm mb-3 border-b border-slate-700 pb-2">
              Custom / Other
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {inventory
                .filter(i => !Object.values(PRESETS).flat().includes(i))
                .map(item => (
                  <span key={item} className="inline-flex items-center gap-2 bg-neon-pink/20 border border-neon-pink text-white px-3 py-1 rounded-full text-sm">
                    {item}
                    <button onClick={() => toggleItem(item)} className="hover:text-red-300">×</button>
                  </span>
                ))
              }
            </div>
            <form onSubmit={addCustomItem} className="flex gap-2">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="Add custom ingredient (e.g. Lavender Syrup)..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-pink"
              />
              <button 
                type="submit"
                disabled={!customItem.trim()}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 text-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-8 py-2 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold rounded-lg shadow-lg hover:shadow-neon-purple/20 transition-all"
          >
            Save Inventory
          </button>
        </div>
      </div>
    </div>
  );
};
