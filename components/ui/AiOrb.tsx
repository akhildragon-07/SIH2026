'use client';

import React from 'react';
import { Sparkles, Mic, CheckCircle2, RefreshCw, Bot, Volume2, HelpCircle, Award } from 'lucide-react';

export type AiOrbState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'CONFIRMING' | 'ANALYZING' | 'RESULT' | 'RECOMMENDING';

interface AiOrbProps {
  state: AiOrbState;
  audioLevel?: number; // 0 to 100
  subtitle?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const STATE_MESSAGES: Record<AiOrbState, { title: string; defaultSubtitle: string; color: string }> = {
  IDLE: {
    title: 'SakshamAI Voice Guide',
    defaultSubtitle: 'Speak in your regional language or tap below',
    color: 'from-emerald-500 via-teal-500 to-cyan-500'
  },
  LISTENING: {
    title: 'Listening...',
    defaultSubtitle: 'Speak naturally in your language...',
    color: 'from-rose-500 via-amber-500 to-emerald-500'
  },
  AI_SPEAKING: {
    title: 'SakshamAI Speaking...',
    defaultSubtitle: 'Listen to the question or guidance...',
    color: 'from-emerald-400 via-teal-400 to-cyan-400'
  },
  PROCESSING: {
    title: 'Processing Speech...',
    defaultSubtitle: 'Understanding your response...',
    color: 'from-teal-400 via-cyan-500 to-blue-500'
  },
  CONFIRMING: {
    title: 'Verbal Confirmation',
    defaultSubtitle: 'Say "Yes" to confirm or "No" to change...',
    color: 'from-amber-400 via-emerald-400 to-teal-400'
  },
  ANALYZING: {
    title: 'Analyzing NSQF Alignment...',
    defaultSubtitle: 'Matching government schemes and grant eligibility...',
    color: 'from-amber-400 via-teal-400 to-emerald-400'
  },
  RESULT: {
    title: 'Profile Analysis Complete',
    defaultSubtitle: 'Found government certified opportunities for you.',
    color: 'from-emerald-400 via-teal-300 to-emerald-500'
  },
  RECOMMENDING: {
    title: 'Personalized Recommendations',
    defaultSubtitle: 'Spoken readout of matched NSQF courses & PM-AJAY grants.',
    color: 'from-emerald-400 via-amber-300 to-teal-400'
  }
};

export default function AiOrb({
  state = 'IDLE',
  audioLevel = 0,
  subtitle,
  onClick,
  size = 'lg'
}: AiOrbProps) {
  const currentConfig = STATE_MESSAGES[state] || STATE_MESSAGES.IDLE;
  const displaySubtitle = subtitle || currentConfig.defaultSubtitle;

  const sizeClasses = {
    sm: 'size-28',
    md: 'size-40',
    lg: 'size-52 sm:size-60'
  }[size];

  // Dynamic scale factor based on audio activity
  const scaleBoost = state === 'LISTENING' ? Math.min(1.2, 1 + (audioLevel / 200)) : 1;

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-4">
      {/* Outer Glow & Orbital Rings Container */}
      <div
        onClick={onClick}
        className={`relative ${sizeClasses} grid place-items-center cursor-pointer transition-transform duration-300 group`}
        style={{ transform: `scale(${scaleBoost})` }}
      >
        {/* State: LISTENING - Concentric Audio Waveforms */}
        {state === 'LISTENING' && (
          <>
            <div className="absolute -inset-8 rounded-full border-2 border-rose-500/30 animate-ping duration-1000 pointer-events-none" />
            <div className="absolute -inset-4 rounded-full border border-amber-400/40 animate-pulse pointer-events-none" />
            <div className="absolute -inset-12 rounded-full border border-emerald-500/20 animate-spin pointer-events-none" style={{ animationDuration: '8s' }} />
          </>
        )}

        {/* State: AI_SPEAKING - Pulsing Emerald Audio Halo */}
        {state === 'AI_SPEAKING' && (
          <>
            <div className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-xl animate-pulse pointer-events-none" />
            <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/60 animate-ping duration-1000 pointer-events-none" />
            <div className="absolute -inset-2 rounded-full border border-teal-400/50 animate-pulse pointer-events-none" />
          </>
        )}

        {/* State: CONFIRMING - Amber-Emerald Glow */}
        {state === 'CONFIRMING' && (
          <>
            <div className="absolute -inset-6 rounded-full bg-amber-500/20 blur-xl animate-pulse pointer-events-none" />
            <div className="absolute -inset-3 rounded-full border-2 border-amber-400/70 shadow-lg shadow-amber-500/30 pointer-events-none" />
          </>
        )}

        {/* State: PROCESSING - Rotating Gradient Ring & Orbiting Particles */}
        {state === 'PROCESSING' && (
          <>
            <div className="absolute -inset-4 rounded-full p-[2px] bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 animate-spin pointer-events-none opacity-80" style={{ animationDuration: '3s' }} />
            <div className="absolute -inset-8 rounded-full border border-dashed border-teal-400/30 animate-spin pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
            <div className="absolute size-2 rounded-full bg-cyan-300 -top-2 left-1/2 -translate-x-1/2 shadow-lg shadow-cyan-400 animate-pulse" />
            <div className="absolute size-2 rounded-full bg-emerald-300 -bottom-2 left-1/3 shadow-lg shadow-emerald-400 animate-pulse" />
          </>
        )}

        {/* State: ANALYZING - Multi-layered Energy Grid */}
        {state === 'ANALYZING' && (
          <>
            <div className="absolute -inset-6 rounded-full border-2 border-amber-400/40 animate-pulse pointer-events-none" />
            <div className="absolute -inset-10 rounded-full border border-teal-400/30 animate-spin pointer-events-none" style={{ animationDuration: '7s' }} />
            <div className="absolute -inset-2 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 animate-spin opacity-90" style={{ animationDuration: '4s' }} />
          </>
        )}

        {/* State: RESULT or RECOMMENDING - Emerald Success Halo */}
        {(state === 'RESULT' || state === 'RECOMMENDING') && (
          <>
            <div className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-xl animate-pulse pointer-events-none" />
            <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/60 shadow-lg shadow-emerald-500/30 pointer-events-none" />
          </>
        )}

        {/* State: IDLE - Subtle Ambient Halo */}
        {state === 'IDLE' && (
          <>
            <div className="absolute -inset-4 rounded-full bg-emerald-500/10 blur-xl animate-pulse pointer-events-none" />
            <div className="absolute -inset-2 rounded-full border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors pointer-events-none" />
          </>
        )}

        {/* Main Central Glowing Orb Sphere */}
        <div
          className={`relative size-full rounded-full bg-gradient-to-br ${currentConfig.color} shadow-2xl flex items-center justify-center p-1 transition-all duration-500 ${
            state === 'LISTENING'
              ? 'ring-4 ring-rose-500/50 shadow-rose-500/40'
              : state === 'AI_SPEAKING'
              ? 'ring-4 ring-emerald-400/50 shadow-emerald-500/40'
              : state === 'PROCESSING'
              ? 'ring-4 ring-cyan-400/50'
              : state === 'CONFIRMING'
              ? 'ring-4 ring-amber-400/50 shadow-amber-500/40'
              : state === 'ANALYZING'
              ? 'ring-4 ring-amber-400/50'
              : state === 'RESULT' || state === 'RECOMMENDING'
              ? 'ring-4 ring-emerald-400/50 shadow-emerald-500/50'
              : 'ring-2 ring-emerald-500/30 group-hover:scale-105'
          }`}
        >
          {/* Inner Glass Sphere Reflection */}
          <div className="size-full rounded-full bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center p-4 border border-white/20 shadow-inner text-white text-center">
            {state === 'IDLE' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <div className="size-11 rounded-2xl bg-emerald-500/20 text-emerald-400 grid place-items-center shadow-inner">
                  <Bot size={24} />
                </div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">SakshamAI</span>
              </div>
            )}

            {state === 'AI_SPEAKING' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <div className="size-11 rounded-2xl bg-emerald-500/20 text-emerald-400 grid place-items-center shadow-inner animate-pulse">
                  <Volume2 size={24} />
                </div>
                {/* Audio wave dynamic bars */}
                <div className="flex items-center gap-1 h-3">
                  {[60, 100, 75, 90, 50].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-emerald-400 animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 150}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {state === 'LISTENING' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <div className="size-11 rounded-2xl bg-rose-500/20 text-rose-400 grid place-items-center animate-pulse shadow-inner">
                  <Mic size={24} />
                </div>
                {/* Radial audio mini-bars */}
                <div className="flex items-center gap-0.5 h-4">
                  {[40, 75, 100, 60, 90, 45, 80].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-rose-400 transition-all duration-75"
                      style={{
                        height: `${Math.max(4, Math.round((h * (audioLevel || 20)) / 100))}px`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {state === 'PROCESSING' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <RefreshCw size={26} className="animate-spin text-cyan-300" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">Processing</span>
              </div>
            )}

            {state === 'CONFIRMING' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <div className="size-11 rounded-2xl bg-amber-500/20 text-amber-400 grid place-items-center shadow-inner animate-pulse">
                  <HelpCircle size={24} />
                </div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Confirming</span>
              </div>
            )}

            {state === 'ANALYZING' && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <Sparkles size={26} className="animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">Mapping NSQF</span>
              </div>
            )}

            {(state === 'RESULT' || state === 'RECOMMENDING') && (
              <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                <div className="size-11 rounded-full bg-emerald-500/20 text-emerald-400 grid place-items-center shadow-md shadow-emerald-500/30">
                  {state === 'RECOMMENDING' ? <Award size={26} className="stroke-[2.5]" /> : <CheckCircle2 size={28} className="stroke-[2.5]" />}
                </div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  {state === 'RECOMMENDING' ? 'Recommended' : 'Matched'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* State Text & Feedback Subtitle */}
      <div className="mt-5 space-y-1 max-w-sm px-4">
        <h3 className="text-lg sm:text-xl font-bold font-serif text-slate-100 flex items-center justify-center gap-2">
          <span>{currentConfig.title}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
}
