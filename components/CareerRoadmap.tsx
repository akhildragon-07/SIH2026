'use client';

import React from 'react';
import { CareerRoadmapStep } from '@/lib/types';
import { CheckCircle2, ChevronRight, GraduationCap, Award, Briefcase, Sparkles, UserCheck, ShieldCheck, IndianRupee } from 'lucide-react';

interface RoadmapProps {
  steps: CareerRoadmapStep[];
  beneficiaryName: string;
}

export default function CareerRoadmap({ steps, beneficiaryName }: RoadmapProps) {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>Personalized Livelihood Roadmap</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Career Progression Roadmap for {beneficiaryName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Structured pathway from current skill baseline to certified NSQF qualification and PM-AJAY GIA grant toolkit.
          </p>
        </div>
      </div>

      {/* Interactive Step-by-Step Flowchart */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-emerald-400">
          <Sparkles size={200} />
        </div>

        <div className="space-y-8 relative z-10">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={step.stepNumber} className="relative flex gap-6">
                {/* Vertical Connector Line */}
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-800 -mb-8" />
                )}

                {/* Step Circle Icon */}
                <div
                  className={`grid size-12 place-items-center rounded-2xl text-sm font-bold shrink-0 z-10 shadow-lg ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  0{step.stepNumber}
                </div>

                {/* Step Content */}
                <div className="flex-1 rounded-2xl bg-slate-950/60 p-5 border border-slate-800/90 space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold font-serif text-slate-100">
                      {step.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                      {step.duration}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-400">{step.subtitle}</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                  {/* GIA Benefit Callout */}
                  {step.giaBenefit && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-300">
                      <ShieldCheck size={14} />
                      <span>{step.giaBenefit}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Projected Outcome Summary Box */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 p-6 border border-emerald-800/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Projected Livelihood Outcome
            </p>
            <p className="text-xl font-bold font-serif text-slate-100 mt-1">
              Sustainable Self-Employment & Enterprise Ownership
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by PM-AJAY GIA Grants-in-Aid Component
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800">
            <IndianRupee size={22} className="text-emerald-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Monthly Income</p>
              <p className="text-lg font-bold font-serif text-emerald-300">₹16,000 – ₹28,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
