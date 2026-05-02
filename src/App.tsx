import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Brain, 
  Utensils, 
  Menu, 
  X, 
  Search, 
  ArrowRight,
  Globe,
  Github,
  Cloud,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MedicineScanner from './components/MedicineScanner';
import SymptomChecker from './components/SymptomChecker';
import NutritionGuide from './components/NutritionGuide';
import DeploymentGuide from './components/DeploymentGuide';

type Tab = 'home' | 'scanner' | 'checker' | 'nutrition' | 'deploy';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Activity },
    { id: 'scanner', label: 'Medicine Scanner', icon: ShieldCheck },
    { id: 'checker', label: 'Symptom Checker', icon: Brain },
    { id: 'nutrition', label: 'Nutrition Guide', icon: Utensils },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'scanner': return <MedicineScanner />;
      case 'checker': return <SymptomChecker />;
      case 'nutrition': return <NutritionGuide />;
      case 'deploy': return <DeploymentGuide />;
      default: return <HomeDashboard onAction={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen text-teal-950 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-circle-1"></div>
        <div className="mesh-circle-2"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-4 md:px-12 flex items-center justify-between z-20">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-teal-900">SehatGuard AI</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-teal-800/70">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`transition-all hover:text-teal-900 ${
                activeTab === item.id 
                  ? 'text-teal-900 border-b-2 border-teal-600 pb-1' 
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-teal-700 transition-all">
              Emergency Mode
           </button>
           <button 
            className="md:hidden p-2 text-teal-950"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
           >
            {isMenuOpen ? <X /> : <Menu />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden"
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as Tab);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl flex items-center gap-4 text-lg font-bold ${
                    activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 w-full h-10 px-4 md:px-12 flex items-center justify-between text-[10px] font-bold text-teal-900/40 uppercase tracking-[0.3em] overflow-hidden">
        <span className="whitespace-nowrap">Microbiology Logic v2.4</span>
        <span className="hidden sm:inline">Human Nutrition Approved</span>
        <span className="whitespace-nowrap">National Health Grid: Online</span>
      </div>

      {/* Footer / Deployment Guide Toggle */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2 space-y-4">
            <div className="text-xl font-black tracking-tighter text-emerald-900 inline-flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              SEHATGUARD <span className="text-emerald-500 font-medium text-sm">AI SYSTEM</span>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              The specialized AI health system for Pakistan. Solving counterfeit medicine issues, inaccessible diagnosis, and providing structured recovery guidance.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Deployment Guide</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li 
                onClick={() => setActiveTab('deploy')}
                className="flex items-center gap-2 justify-center md:justify-start hover:text-emerald-600 cursor-pointer"
              >
                <Github className="w-4 h-4" /> GitHub Repository
              </li>
              <li 
                onClick={() => setActiveTab('deploy')}
                className="flex items-center gap-2 justify-center md:justify-start hover:text-emerald-600 cursor-pointer"
              >
                <Cloud className="w-4 h-4" /> Hugging Face Spaces
              </li>
              <li 
                onClick={() => setActiveTab('deploy')}
                className="flex items-center gap-2 justify-center md:justify-start hover:text-emerald-600 cursor-pointer"
              >
                <Activity className="w-4 h-4" /> Vercel / Netlify
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-end justify-center">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">Developed By</span>
            <span className="text-sm font-semibold text-gray-400">Microbiology & CS Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeDashboard({ onAction }: { onAction: (tab: Tab) => void }) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-teal-950/90 backdrop-blur-xl p-8 md:p-16 text-white text-center md:text-left shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 uppercase tracking-widest">
            <Activity className="w-3 h-3" /> System Live in Pakistan
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            INTELLIGENT <br /> HEALTH <span className="text-teal-400">GUARD.</span>
          </h1>
          <p className="text-teal-100/70 text-lg md:text-xl font-medium max-w-lg leading-tight mt-4">
            Turn your smartphone into a medical-grade screening tool. Drug verification, diagnosis, and recovery support in one app.
          </p>
          <div className="flex flex-wrap gap-4 pt-6 justify-center md:justify-start">
            <button 
              onClick={() => onAction('scanner')}
              className="px-8 py-4 bg-teal-400 hover:bg-teal-300 text-teal-950 font-black rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-teal-400/20 uppercase tracking-widest text-xs"
            >
              Scan Medicine <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onAction('checker')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold rounded-2xl transition-all border border-white/10 text-sm"
            >
              Check Symptoms
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-teal-400/10 blur-[100px] rounded-full pointer-events-none"></div>
        <Brain className="absolute bottom-[-20px] right-[-20px] w-80 h-80 text-teal-400/5 hidden lg:block" />
      </section>

      {/* Feature Grid */}
      <section className="grid lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={ShieldCheck}
          title="Medicine Scanner"
          desc="AI vision flags blurry printing, inconsistent fonts, and spelling errors in fake drug packaging."
          onClick={() => onAction('scanner')}
        />
        <FeatureCard 
          icon={Brain}
          title="Symptom Diagnostic"
          desc="Identifies common local illnesses like Dengue, Typhoid, and Malaria using expert-built trees."
          onClick={() => onAction('checker')}
        />
        <FeatureCard 
          icon={Utensils}
          title="Recovery Nutrition"
          desc="Complete, disease-specific recovery meal plans designed by certified nutritionists."
          onClick={() => onAction('nutrition')}
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="frosted-card p-8 group cursor-pointer hover:translate-y-[-4px] transition-all"
    >
      <div className="mb-6">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-2 block">Available Step</span>
         <h3 className="text-3xl font-bold text-teal-950 leading-tight">{title}</h3>
      </div>
      <p className="text-teal-800/60 text-sm leading-relaxed mb-8">
        {desc}
      </p>
      <div className="flex items-center gap-2 text-xs font-black text-teal-700 uppercase tracking-widest group-hover:gap-4 transition-all">
        Launch Tool <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}
