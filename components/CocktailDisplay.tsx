
import React, { useState } from 'react';
import { GeneratedCocktail } from '../types';

interface CocktailDisplayProps {
  cocktail: GeneratedCocktail;
  onReset: () => void;
  onRedo: (feedback: string) => void;
}

export const CocktailDisplay: React.FC<CocktailDisplayProps> = ({ cocktail, onReset, onRedo }) => {
  const [feedback, setFeedback] = useState('');
  const [isRedoing, setIsRedoing] = useState(false);

  const handleRedoClick = () => {
    setIsRedoing(true);
    onRedo(feedback);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image, Stats, Ingredients & Method */}
        <div className="space-y-6">
          {/* Image Card */}
          <div className="glass-panel p-2 rounded-2xl shadow-2xl relative group">
             {/* Neon Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue to-neon-purple opacity-20 blur-2xl -z-10 group-hover:opacity-30 transition-opacity duration-700" />
            
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-900">
              {cocktail.imageUrl ? (
                <img 
                  src={cocktail.imageUrl} 
                  alt={cocktail.name} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <span>Image Unavailable</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Service Details Card */}
          <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Service Details</h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <span className="block text-neon-blue text-sm mb-1">Glassware</span>
                  <span className="text-white text-lg font-serif italic">{cocktail.glassware}</span>
               </div>
               <div>
                  <span className="block text-neon-purple text-sm mb-1">Garnish</span>
                  <span className="text-white text-lg font-serif italic">{cocktail.garnish}</span>
               </div>
             </div>
          </div>

          {/* Ingredients & Method Card */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

             <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
               Ingredients
             </h3>
             <ul className="space-y-3 mb-8">
               {cocktail.ingredients.map((ing, idx) => (
                 <li key={idx} className="flex items-center justify-between text-slate-200 group">
                   <span className="font-medium">{ing.item}</span>
                   <div className="flex-1 border-b border-dashed border-slate-700 mx-4 opacity-30"></div>
                   <span className="text-neon-blue font-bold">{ing.amount}</span>
                 </li>
               ))}
             </ul>

             <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">
               Method
             </h3>
             <p className="text-slate-300 leading-relaxed whitespace-pre-line">
               {cocktail.instructions}
             </p>
          </div>
        </div>

        {/* Right Column: Story & Actions */}
        <div className="space-y-8 sticky top-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
              {cocktail.name}
            </h2>
            <p className="text-neon-pink font-medium tracking-wide text-sm md:text-base mb-6">
              "{cocktail.tagline}"
            </p>
            <p className="text-slate-300 leading-relaxed italic border-l-2 border-neon-blue pl-4 text-lg">
              {cocktail.story}
            </p>
          </div>

          <div className="flex flex-col gap-4 pt-4">
             {/* Main Action Buttons */}
             <button
               onClick={onReset}
               className="w-full md:w-auto px-8 py-3 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-white hover:bg-white/5 transition-all uppercase tracking-wider text-sm font-semibold"
             >
               Start Over with New Profile
             </button>

             {/* Redo Section */}
             <div className="mt-8 pt-8 border-t border-slate-800">
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-3">
                   Not quite right?
                </h4>
                <div className="bg-slate-800/50 p-6 rounded-xl space-y-4 border border-slate-700/50">
                   <p className="text-sm text-slate-400">
                      If you're unsatisfied, tell the AI bartender why, and we'll refine the recipe for you.
                   </p>
                   <textarea 
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                     placeholder="e.g., Too sweet! I wanted something more bitter, or I don't like gin..."
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neon-purple resize-none h-24 placeholder:text-slate-600"
                   />
                   <div className="flex justify-end">
                      <button
                        onClick={handleRedoClick}
                        disabled={isRedoing || !feedback.trim()}
                        className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all
                          ${!feedback.trim() || isRedoing
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-neon-purple text-white hover:bg-purple-600 shadow-lg shadow-neon-purple/20'
                          }`}
                      >
                         {isRedoing ? 'Refining...' : 'Refine & Redo'}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
