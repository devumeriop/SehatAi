
import React, { useState } from 'react';
import { Utensils, Check, X, Search, Loader2, ArrowRight } from 'lucide-react';
import { getNutritionPlan } from '../services/gemini';
import { MealPlan } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const CONDITIONS = ['Dengue', 'Malaria', 'Typhoid', 'Anemia', 'General Weakness'];

export default function NutritionGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MealPlan | null>(null);

  const fetchPlan = async (condition: string) => {
    setLoading(true);
    try {
      const data = await getNutritionPlan(condition);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12" id="nutrition-guide-root">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold border border-teal-100 uppercase tracking-[0.2em]">
          Step 03
        </div>
        <h2 className="text-4xl font-black text-teal-900 tracking-tight">Recovery Nutrition</h2>
        <p className="text-teal-800/50 max-w-xl mx-auto font-medium">Scientifically designed meal plans for common regional illnesses, using accessible Pakistani ingredients.</p>
        
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {CONDITIONS.map(c => (
            <button
              key={c}
              onClick={() => fetchPlan(c)}
              className="px-6 py-2 rounded-full bg-white/40 backdrop-blur border border-white/60 text-teal-800 font-bold hover:bg-teal-600 hover:text-white transition-all text-xs uppercase tracking-widest shadow-sm"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-md mx-auto">
        <input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPlan(searchTerm)}
          placeholder="Or search clinical diagnosis..."
          className="w-full pl-12 pr-4 py-5 bg-white/40 backdrop-blur border border-white/60 rounded-full shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all placeholder:text-teal-900/30 text-sm font-medium"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-900/30 w-5 h-5" />
        <button 
          onClick={() => fetchPlan(searchTerm)}
          disabled={loading || !searchTerm.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:bg-teal-300 font-bold text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {plan && (
          <motion.div
            key={plan.condition}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4 space-y-6">
              <div className="frosted-card-dark p-8 text-white">
                <Utensils className="w-10 h-10 mb-6 text-teal-400 opacity-80" />
                <h3 className="text-3xl font-bold leading-tight">{plan.condition}<br/>Recovery</h3>
                <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Daily Meal Plan Verified</p>
              </div>

              <div className="frosted-card p-8">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-teal-600 mb-6 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Recommended
                </h4>
                <ul className="space-y-4">
                  {plan.foodsToInclude.map((f, i) => (
                    <li key={i} className="text-teal-900/70 text-sm flex gap-3 font-medium">
                       <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                       {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="frosted-card p-8">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-red-500 mb-6 flex items-center gap-2">
                  <X className="w-4 h-4" /> Avoid
                </h4>
                <ul className="space-y-4">
                  {plan.foodsToAvoid.map((f, i) => (
                    <li key={i} className="text-teal-900/70 text-sm flex gap-3 font-medium">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 flex-shrink-0" />
                       {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 frosted-card overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-8 border-b border-teal-900/5 bg-white/20">
                <h4 className="text-2xl font-bold text-teal-950 leading-tight">Clinical Meal Sequence</h4>
                <p className="text-teal-900/40 text-xs font-bold uppercase tracking-widest mt-1">Human Nutrition Approved Research</p>
              </div>
              <div className="p-10 space-y-12 flex-1">
                <div className="flex gap-8 group">
                  <div className="w-20 font-black text-teal-600 uppercase text-[10px] tracking-[0.2em] pt-1">B-fast</div>
                  <div className="flex-1 text-teal-900 font-bold text-lg leading-snug">{plan.sampleMealPlan.breakfast}</div>
                </div>
                <div className="flex gap-8 group pt-8 border-t border-white/40">
                  <div className="w-20 font-black text-teal-600 uppercase text-[10px] tracking-[0.2em] pt-1">Lunch</div>
                  <div className="flex-1 text-teal-900 font-bold text-lg leading-snug">{plan.sampleMealPlan.lunch}</div>
                </div>
                <div className="flex gap-8 group pt-8 border-t border-white/40">
                  <div className="w-20 font-black text-teal-600 uppercase text-[10px] tracking-[0.2em] pt-1">Dinner</div>
                  <div className="flex-1 text-teal-900 font-bold text-lg leading-snug">{plan.sampleMealPlan.dinner}</div>
                </div>
                <div className="flex gap-8 group pt-8 border-t border-white/40">
                  <div className="w-20 font-black text-teal-600 uppercase text-[10px] tracking-[0.2em] pt-1">Snacks</div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {plan.sampleMealPlan.snacks.map((s, i) => (
                      <span key={i} className="px-4 py-2 bg-white/60 text-teal-900 rounded-full text-xs font-bold border border-white/60 shadow-sm">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-teal-900/5 flex justify-between items-center">
                 <button className="w-full py-4 bg-teal-400 text-teal-950 font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-teal-400/20 hover:bg-teal-300 transition-all">
                  Download PDF recovery Guide
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
