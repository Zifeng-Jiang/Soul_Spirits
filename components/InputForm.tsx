
import React, { useState, useEffect } from 'react';
import { UserProfile, MBTI_TYPES, ZODIAC_SIGNS, AGE_GROUPS } from '../types';

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
  initialData?: UserProfile;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [profile, setProfile] = useState<UserProfile>(initialData || {
    name: '',
    ageGroup: '',
    mbti: '',
    zodiac: '',
    mood: '',
    preferences: ''
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);

  // Verification Logic (Simple Math Captcha)
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  
  // Generate a new math problem on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1: n1, num2: n2, answer: '' });
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptcha(prev => ({ ...prev, answer: e.target.value }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Age Verification
    if (profile.ageGroup === 'underage') {
      setValidationError("We adhere to responsible drinking standards. You must be 21 or older to use this application.");
      return;
    }

    // Required Field Verification
    if (!profile.ageGroup || !profile.zodiac || !profile.mbti) {
      setValidationError("Please fill in all required fields (Age, Zodiac, and MBTI).");
      return;
    }

    if (!profile.name.trim() || !profile.mood.trim()) {
      setValidationError("Please fill in all required fields (Name and Mood).");
      return;
    }

    // Captcha Verification
    const sum = parseInt(captcha.answer);
    if (isNaN(sum) || sum !== (captcha.num1 + captcha.num2)) {
      setValidationError("Incorrect verification answer. Please try again.");
      generateCaptcha(); // Reset captcha on failure
      return;
    }

    onSubmit(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (validationError) setValidationError(null);
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl shadow-2xl w-full border-t border-white/10">
      <div className="mb-6 pb-6 border-b border-white/5">
        <h2 className="text-2xl font-light text-center text-slate-200">
          {initialData ? "Adjust your essence" : "Who are you tonight?"}
        </h2>
        <p className="text-center text-slate-500 text-sm mt-2">Fields marked with <span className="text-neon-purple">*</span> are required</p>
      </div>
      
      {validationError && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-3">
          <span className="text-xl">🚫</span>
          <p>{validationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Name <span className="text-neon-purple">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              value={profile.name}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
            />
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Age Group <span className="text-neon-purple">*</span>
            </label>
            <div className="relative">
              <select
                name="ageGroup"
                required
                value={profile.ageGroup}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple appearance-none transition-colors"
              >
                {AGE_GROUPS.map(group => (
                  <option key={group.value} value={group.value} disabled={group.value === ''}>
                    {group.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* Zodiac */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Zodiac Sign <span className="text-neon-purple">*</span>
            </label>
            <div className="relative">
              <select
                name="zodiac"
                required
                value={profile.zodiac}
                onChange={handleChange}
                className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple appearance-none transition-colors ${!profile.zodiac && 'text-slate-400'}`}
              >
                <option value="" disabled>Select your Zodiac...</option>
                {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign} className="text-white">{sign}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* MBTI */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              MBTI Type <span className="text-neon-purple">*</span>
            </label>
             <div className="relative">
              <select
                name="mbti"
                required
                value={profile.mbti}
                onChange={handleChange}
                className={`w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple appearance-none transition-colors ${!profile.mbti && 'text-slate-400'}`}
              >
                <option value="" disabled>Select your MBTI...</option>
                {MBTI_TYPES.map(type => <option key={type} value={type} className="text-white">{type}</option>)}
              </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Current Mood <span className="text-neon-purple">*</span>
            </label>
            <input
              type="text"
              name="mood"
              required
              placeholder="e.g., Melancholy, ecstatic, tired, adventurous..."
              value={profile.mood}
              onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
            />
          </div>
        </div>

        {/* Preferences (Optional) */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex justify-between">
            <span>Taste Preferences & Allergies</span>
            <span className="text-slate-600 font-normal lowercase">(Optional)</span>
          </label>
          <textarea
            name="preferences"
            rows={2}
            placeholder="e.g., I love sour drinks. ALERT: I am allergic to peanuts and strawberries."
            value={profile.preferences}
            onChange={handleChange}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors resize-none"
          />
        </div>

        {/* Verification Check */}
        <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
           <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 block">
             Security Check <span className="text-neon-purple">*</span>
           </label>
           <div className="flex items-center gap-4">
             <div className="text-white font-mono text-lg bg-slate-900 px-3 py-2 rounded border border-slate-600">
               {captcha.num1} + {captcha.num2} = ?
             </div>
             <input 
               type="text" // using text to prevent browser number spinners
               pattern="[0-9]*"
               inputMode="numeric"
               required
               placeholder="Answer"
               value={captcha.answer}
               onChange={handleCaptchaChange}
               className="w-24 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
             />
           </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide uppercase transition-all duration-300 shadow-lg
            ${isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:shadow-neon-purple/50 hover:scale-[1.01]'
            }`}
        >
          {isLoading ? 'Consulting the Spirits...' : 'SERVE MY DRINK NOW!'}
        </button>
      </form>
    </div>
  );
};
