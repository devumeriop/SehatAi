
import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { analyzeMedicine } from '../services/gemini';
import { MedicineAnalysis } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function MedicineScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicineAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeMedicine(base64Data);
      setResult(data);
    } catch (err) {
      setError("Failed to analyze medicine. Please try again with a clearer photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" id="medicine-scanner-root">
      <div className="frosted-card p-8">
        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-1 block">Step 01</span>
          <h2 className="text-3xl font-bold text-teal-950 leading-tight">Medicine Scanner</h2>
        </div>
        <p className="text-teal-800/60 mb-8 text-sm">Scan your medicine packaging to check for potential counterfeits or identification issues.</p>

        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-teal-200 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-500/5 transition-colors relative group overflow-hidden"
          >
            <div className="absolute inset-4 border-2 border-teal-500/10 rounded-xl group-hover:border-teal-500/30 transition-colors"></div>
            <div className="w-16 h-16 bg-teal-100/50 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <Camera className="w-8 h-8 text-teal-600" />
            </div>
            <p className="text-teal-800 font-bold text-sm uppercase tracking-widest">Capture or Upload</p>
            <p className="text-teal-900/40 text-[10px] mt-2 font-black uppercase tracking-tighter">Align packaging box to scan</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-black/5 aspect-video flex items-center justify-center border border-teal-100">
              <img src={image} alt="Medicine" className="max-h-full object-contain" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white text-teal-700 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-teal-500/20 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? "Analyzing Packaging..." : "Verify Authenticity"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[2rem] p-8 border ${result.isCounterfeit ? 'bg-red-50/50 backdrop-blur border-red-100 shadow-xl' : 'bg-teal-50/50 backdrop-blur border-teal-100 shadow-xl'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${result.isCounterfeit ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {result.isCounterfeit ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${result.isCounterfeit ? 'text-red-900' : 'text-emerald-900'}`}>
                  {result.isCounterfeit ? 'Authenticity Alert' : 'Likely Authentic'}
                </h3>
                <div className="mt-2 text-gray-700 space-y-4">
                  <div>
                    <span className="font-semibold text-sm uppercase tracking-wider text-gray-500">Drug:</span>
                    <p className="text-lg font-medium">{result.drugName || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm uppercase tracking-wider text-gray-500">Diagnosis:</span>
                    <p className="leading-relaxed">{result.reasoning}</p>
                  </div>
                  {result.warnings && result.warnings.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-xl border border-red-200">
                      <span className="text-red-700 font-bold block mb-2 text-sm uppercase">Critical Warnings:</span>
                      <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                        {result.warnings.map((w, i) => ( <li key={i}>{w}</li> ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Confidence</span>
                <span className={`text-2xl font-black ${result.isCounterfeit ? 'text-red-600' : 'text-emerald-600'}`}>
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 flex gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-center text-xs text-gray-400 uppercase tracking-widest px-8">
        Disclaimer: This scanner is for informational purposes only. AI can make mistakes. Always verify with a licensed pharmacist or doctor.
      </p>
    </div>
  );
}
