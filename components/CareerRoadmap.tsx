'use client';

import React from 'react';
import { CareerRoadmapStep } from '@/lib/types';
import {
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Award,
  Briefcase,
  Sparkles,
  UserCheck,
  ShieldCheck,
  IndianRupee,
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface RoadmapProps {
  steps: CareerRoadmapStep[];
  beneficiaryName: string;
  onFindOpportunities?: () => void;
}

export default function CareerRoadmap({ steps, beneficiaryName, onFindOpportunities }: RoadmapProps) {
  // 7-Step Unified Location-Integrated Progression Pathway
  const unifiedPathwaySteps = [
    {
      num: '01',
      title: 'Current Skills Assessment',
      subtitle: 'Baseline Competency Mapping',
      desc: 'Identify pre-existing traditional or practical skills via multilingual voice diagnostic.',
      badge: 'Completed',
      color: 'emerald'
    },
    {
      num: '02',
      title: 'Skill Gap Diagnostics',
      subtitle: 'Target Occupation Alignment',
      desc: 'Pinpoint critical missing skills and sector standards required for formal qualification.',
      badge: 'Mapped',
      color: 'emerald'
    },
    {
      num: '03',
      title: 'NSQF Accredited Training',
      subtitle: 'Level 3-5 Course Curriculum',
      desc: 'Enroll in an official NCVET Qualification Pack (QP) aligned skill development program.',
      badge: 'In Progress',
      color: 'amber'
    },
    {
      num: '04',
      title: 'Nearby Training Center',
      subtitle: 'Geographically Proximate Facility',
      desc: 'Access verified ITI or PMKK training center located within beneficiary district radius.',
      badge: 'Location Mapped',
      color: 'blue'
    },
    {
      num: '05',
      title: 'Official Qualification & Certificate',
      subtitle: 'NCVET Assessment & Skill Card',
      desc: 'Attain national certification unlocking institutional credibility and credit linkage.',
      badge: 'Milestone',
      color: 'purple'
    },
    {
      num: '06',
      title: 'Nearby Job / Self-Employment Unit',
      subtitle: 'PM-AJAY GIA Grant Support',
      desc: 'Establish independent enterprise with GIA machinery grant or join verified nearby wage opening.',
      badge: 'GIA Eligible',
      color: 'amber'
    },
    {
      num: '07',
      title: 'Sustainable Income Opportunity',
      subtitle: 'Economic Empowerment',
      desc: 'Achieve reliable monthly earnings (₹14,000 – ₹28,000) and long-term financial security.',
      badge: 'Target Outcome',
      color: 'emerald'
    }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>Integrated NSQF + Location Roadmap</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Career Progression Roadmap for {beneficiaryName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end pathway from initial voice onboarding to nearby NSQF training, PM-AJAY GIA toolkit grant, and sustainable earnings.
          </p>
        </div>

        {onFindOpportunities && (
          <button
            type="button"
            onClick={onFindOpportunities}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-6 py-3 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
          >
            <MapPin size={16} />
            <span>Find Opportunities Near Me</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* 7-Step Visual Progression Flowchart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold font-serif text-slate-100">
              7-Stage Livelihood Transition Pipeline
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            PM-AJAY + NSQF Integrated Architecture
          </span>
        </div>

        {/* 7-Stage Horizontal / Vertical Flow Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {unifiedPathwaySteps.map((stage, i) => (
            <div
              key={stage.num}
              className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-emerald-500/40 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {stage.num}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                    {stage.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 mt-2 group-hover:text-emerald-300">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {stage.subtitle}
                </p>
              </div>

              {i < 6 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-slate-700 z-10 pointer-events-none">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
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

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800">
              <IndianRupee size={22} className="text-emerald-400" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Monthly Income</p>
                <p className="text-lg font-bold font-serif text-emerald-300">₹16,000 – ₹28,000</p>
              </div>
            </div>

            {onFindOpportunities && (
              <button
                type="button"
                onClick={onFindOpportunities}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 text-xs font-bold transition-all shadow-md"
              >
                <MapPin size={14} />
                <span>Explore Nearby Centers</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
