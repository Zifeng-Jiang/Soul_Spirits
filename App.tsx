
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { CocktailDisplay } from './components/CocktailDisplay';
import { InventoryModal } from './components/InventoryModal';
import { generateRecipe, generateCocktailImage } from './services/gemini';
import { UserProfile, GeneratedCocktail, AppStatus } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [cocktail, setCocktail] = useState<GeneratedCocktail | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State to persist user inputs between sessions
  const [savedProfile, setSavedProfile] = useState<UserProfile | undefined>(undefined);

  // Inventory State
  const [inventory, setInventory] = useState<string[]>([]);
  const [strictMode, setStrictMode] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInv = localStorage.getItem('soul-spirits-inventory');
    const savedStrict = localStorage.getItem('soul-spirits-strict');
    if (savedInv) setInventory(JSON.parse(savedInv));
    if (savedStrict) setStrictMode(JSON.parse(savedStrict));
  }, []);

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('soul-spirits-inventory', JSON.stringify(inventory));
    localStorage.setItem('soul-spirits-strict', JSON.stringify(strictMode));
  }, [inventory, strictMode]);

  const handleCreateCocktail = async (profile: UserProfile, critique?: string) => {
    // Save the profile so it can be restored if the user wants to try again
    if (!critique) {
      setSavedProfile(profile);
    }
    
    setStatus(AppStatus.GENERATING_RECIPE);
    setError(null);
    setCocktail(null);

    try {
      // Step 1: Generate Recipe Logic
      // Pass the critique if this is a redo request, plus inventory settings
      const recipe = await generateRecipe(profile, inventory, strictMode, critique);
      
      // Update state with recipe immediately so user knows something happened
      // However, we wait for image to show the full display
      setStatus(AppStatus.GENERATING_IMAGE);

      // Step 2: Generate Visuals
      const imageUrl = await generateCocktailImage(recipe.visualDescription);

      // Combine results
      setCocktail({
        ...recipe,
        imageUrl
      });
      setStatus(AppStatus.COMPLETE);

    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(err.message || "The spirits were silent. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleRedo = (feedback: string) => {
    if (savedProfile) {
      handleCreateCocktail(savedProfile, feedback);
    }
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setCocktail(null);
    setError(null);
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-neon-purple selection:text-white pb-20 relative overflow-x-hidden font-sans bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f1020]">
      
      {/* Subtle Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <Header />

        <main className="mt-8 md:mt-12">
          {status === AppStatus.IDLE && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in-up">
              
              {/* Introduction & Hero Section */}
              <div className="lg:col-span-5 space-y-8 pt-4">
                <div>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 drop-shadow-md">
                    A Cocktail as Unique as Your Soul
                  </h2>
                  <p className="text-slate-200 text-lg leading-relaxed mb-6 font-light drop-shadow-sm">
                    Welcome to <span className="text-neon-blue font-semibold">Soul Spirits</span>. We don't just mix drinks; we translate your personality into liquid art. 
                  </p>
                  <p className="text-slate-300 leading-relaxed font-light">
                    By analyzing your astrological sign, MBTI personality type, and current emotional state, our AI mixologist crafts a bespoke recipe tailored specifically to your vibe right now.
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border-l-4 border-neon-purple bg-slate-900/60 backdrop-blur-xl">
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">How it works</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-slate-200">
                      <span className="flex items-center justify-center min-w-[2rem] w-8 h-8 rounded-full bg-slate-800 text-neon-purple border border-slate-700 font-bold shadow-lg shadow-neon-purple/10">1</span>
                      <span className="font-medium">Share your mood, personality, and vibe.</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-200">
                      <span className="flex items-center justify-center min-w-[2rem] w-8 h-8 rounded-full bg-slate-800 text-neon-blue border border-slate-700 font-bold shadow-lg shadow-neon-blue/10">2</span>
                      <span className="font-medium">AI crafts your custom recipe & visuals.</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-200">
                      <span className="flex items-center justify-center min-w-[2rem] w-8 h-8 rounded-full bg-slate-800 text-neon-pink border border-slate-700 font-bold shadow-lg shadow-neon-pink/10">3</span>
                      <span className="font-medium">Love it? Make it. Or refine & remix.</span>
                    </li>
                  </ul>
                </div>

                <div className="hidden lg:block text-slate-400 text-sm italic opacity-80">
                  * Must be 21+ to use. Please drink responsibly.
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-7">
                <InputForm 
                  onSubmit={(profile) => handleCreateCocktail(profile)} 
                  isLoading={false} 
                  initialData={savedProfile}
                />
              </div>
            </div>
          )}

          {(status === AppStatus.GENERATING_RECIPE || status === AppStatus.GENERATING_IMAGE) && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
              <div className="w-24 h-24 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(176,38,255,0.3)]"></div>
              <h2 className="text-2xl font-serif italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {status === AppStatus.GENERATING_RECIPE ? "Divining the perfect recipe..." : "Materializing your spirit..."}
              </h2>
              <p className="text-neon-blue mt-4 text-sm uppercase tracking-widest font-bold">
                AI is mixing ingredients
              </p>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="max-w-md mx-auto text-center mt-12 glass-panel p-8 rounded-xl border-red-500/30 bg-slate-900/80">
              <div className="text-red-400 text-4xl mb-4">⚠</div>
              <h3 className="text-xl font-bold text-red-200 mb-2">Generation Failed</h3>
              <p className="text-slate-400 mb-6">{error}</p>
              <button 
                onClick={resetApp}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {status === AppStatus.COMPLETE && cocktail && (
            <CocktailDisplay 
              cocktail={cocktail} 
              onReset={resetApp} 
              onRedo={handleRedo}
            />
          )}
        </main>
      </div>

      {/* Floating Inventory Button */}
      <button 
        onClick={() => setIsInventoryOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-slate-900/90 backdrop-blur-md hover:bg-neon-purple text-white p-4 rounded-full shadow-lg shadow-black/50 border border-slate-600 hover:border-white transition-all duration-300 group"
        title="Bar Inventory"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
          Manage Inventory
        </span>
      </button>

      {/* Inventory Modal */}
      <InventoryModal 
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={inventory}
        setInventory={setInventory}
        strictMode={strictMode}
        setStrictMode={setStrictMode}
      />
    </div>
  );
}

export default App;
