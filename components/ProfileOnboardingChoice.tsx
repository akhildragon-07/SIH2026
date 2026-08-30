'use client';

import React from 'react';
import { Mic, MessageSquareCode, Edit3, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

interface ChoiceProps {
  onSelectMethod: (method: 'voice' | 'text' | 'manual') => void;
}

export default function ProfileOnboardingChoice({ onSelectMethod }: ChoiceProps) {
  return (
    <div className="w-full mx-auto max-w-4xl px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} />
          <span>PM-AJAY Beneficiary Onboarding</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold font-serif text-slate-100">
          How would you like to create your profile?
        </h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Select your preferred onboarding method. Speak in your native language, chat step-by-step with SakshamAI, or fill out the form directly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Method A: Voice */}
        <button
          onClick={() => onSelectMethod('voice')}
          className="group relative rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 text-left transition-all hover:scale-[1.02] hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="size-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 grid place-items-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Mic size={28} className="animate-pulse" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Recommended for Voice Users
            </span>

            <h3 className="text-2xl font-bold font-serif text-slate-100 mt-3">
              🎤 Create with Voice
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Speak naturally in English, Hindi, Telugu, Tamil, or Marathi. AI converts your speech into a persistent profile.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Start Voice Assistant</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Method B: Text Chat */}
        <button
          onClick={() => onSelectMethod('text')}
          className="group relative rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-left transition-all hover:scale-[1.02] hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="size-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 grid place-items-center text-teal-400 mb-6 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
              <MessageSquareCode size={28} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
              Step-by-Step AI Chat
            </span>

            <h3 className="text-2xl font-bold font-serif text-slate-100 mt-3">
              💬 Create with Text
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Answer friendly conversational questions one by one. SakshamAI builds your profile automatically.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-teal-400">
            <span>Start Text Chat</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>

        {/* Method C: Manual Form */}
        <button
          onClick={() => onSelectMethod('manual')}
          className="group relative rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-left transition-all hover:scale-[1.02] hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="size-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 grid place-items-center text-amber-400 mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Edit3 size={28} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Direct Form Entry
            </span>

            <h3 className="text-2xl font-bold font-serif text-slate-100 mt-3">
              📝 Fill Manually
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Standard structured form with fields for education, location, skills, experience, and livelihood preferences.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Open Manual Form</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck size={16} className="text-emerald-400" />
        <span>Your profile persists securely and can be updated anytime from your dashboard.</span>
      </div>
    </div>
  );
}
