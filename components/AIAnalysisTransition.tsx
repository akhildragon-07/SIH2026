'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import AiOrb from './ui/AiOrb';

interface AIAnalysisTransitionProps {
  beneficiaryName: string;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  { id: 1, label: 'Skills analyzed & baseline mapped', icon: GraduationCap },
  { id: 2, label: 'PM-AJAY GIA eligibility checked', icon: ShieldCheck },
  { id: 3, label: 'Livelihood interests & goals matched', icon: Briefcase },
  { id: 4, label: 'District location & spatial proximity computed', icon: MapPin },
  { id: 5, label: 'NSQF courses & enterprise opportunities ranked', icon: Sparkles }
];

export default function AIAnalysisTransition({
  beneficiaryName,
  onComplete
}: AIAnalysisTransitionProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Sequentially complete steps every 450ms
    const timer1 = setTimeout(() => setCompletedSteps((prev) => [...prev, 1]), 400);
    const timer2 = setTimeout(() => setCompletedSteps((prev) => [...prev, 2]), 900);
    const timer3 = setTimeout(() => setCompletedSteps((prev) => [...prev, 3]), 1400);
    const timer4 = setTimeout(() => setCompletedSteps((prev) => [...prev, 4]), 1900);
    const timer5 = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, 5]);
      setIsDone(true);
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="w-full mx-auto max-w-3xl px-4 py-12 flex flex-col items-center justify-center">
      <div className="w-full rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-400">
        {/* Animated AI Orb in ANALYZING or RESULT State */}
        <AiOrb
          state={isDone ? 'RESULT' : 'ANALYZING'}
          size="md"
          subtitle={
            isDone
              ? 'Your personalized opportunities are ready.'
              : `Analyzing profile data for ${beneficiaryName}...`
          }
        />

        {/* 5-Step Animated Checklist */}
        <div className="max-w-md mx-auto space-y-3 text-left pt-2">
          {ANALYSIS_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = !isCompleted && completedSteps.length + 1 === step.id;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-slate-800/80 border-amber-500/40 text-amber-300 animate-pulse'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-8 rounded-xl grid place-items-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon size={14} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {step.label}
                  </span>
                </div>

                <div className="shrink-0 ml-2">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 animate-in zoom-in duration-200">
                      <CheckCircle2 size={16} />
                    </span>
                  ) : isCurrent ? (
                    <RefreshCw size={14} className="animate-spin text-amber-400" />
                  ) : (
                    <span className="size-2 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready Action Button */}
        {isDone && (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
            <button
              onClick={onComplete}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-8 py-4 font-bold text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-105 cursor-pointer"
            >
              <span>Explore Personalized Opportunities & Roadmap</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
