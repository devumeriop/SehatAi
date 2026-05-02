
import React from 'react';
import { Github, Cloud, Rocket, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DeploymentGuide() {
  const platforms = [
    {
      name: 'Vercel / Netlify',
      icon: Rocket,
      steps: [
        'Connect your GitHub repository.',
        'Set Framework Preset to "Vite".',
        'Add Environment Variable: GEMINI_API_KEY.',
        'Deploy!'
      ],
      link: 'https://vercel.com/new'
    },
    {
      name: 'Hugging Face Spaces',
      icon: Cloud,
      steps: [
        'Create a new Space.',
        'Select "Static" or "Docker" SDK.',
        'Upload your files or connect via Git.',
        'Add GEMINI_API_KEY in Space Settings (Secrets).'
      ],
      link: 'https://huggingface.co/new-space'
    },
    {
      name: 'Standard Build',
      icon: Github,
      steps: [
        'Run "npm run build".',
        'Upload contents of "/dist" to any static host.',
        'Ensure your API key is secured (Backend proxy recommended for production).'
      ],
      link: '#'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12" id="deployment-guide">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100">
          Pro Guide
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">How to Deploy SehatGuard</h2>
        <p className="text-gray-500 max-w-xl mx-auto">Follow these steps to take SehatGuard AI live on your preferred platform.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((p, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col"
          >
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
              <p.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">{p.name}</h3>
            <ul className="space-y-4 flex-1">
              {p.steps.map((step, si) => (
                <li key={si} className="text-sm text-gray-500 flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {si + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
            <a 
              href={p.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
            >
              Go to Platform <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>

      <div className="bg-emerald-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-emerald-400" />
             <h3 className="text-2xl font-bold">Important Security Note</h3>
          </div>
          <p className="text-emerald-100 leading-relaxed font-medium">
            For production apps, avoid exposing your <span className="text-emerald-400 font-bold">GEMINI_API_KEY</span> in client-side code. While this app handles it via environment variables, a standard production setup should use a backend proxy (like the Express server included in this template) to keep the key hidden from users.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
