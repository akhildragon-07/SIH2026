'use client';

import React from 'react';
import { ArrowRight, BarChart3, Briefcase, ChevronRight, Compass, GraduationCap, Landmark, Mic, ShieldCheck, Sparkles, UserCheck, Users, Volume2 } from 'lucide-react';
import { BeneficiaryProfile } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';

interface LandingPageProps {
  onStartVoice: () => void;
  onOpenAdmin: () => void;
  onOpenForm: () => void;
  onLoadDemo: (profile: BeneficiaryProfile) => void;
}

export default function LandingPage({ onStartVoice, onOpenAdmin, onOpenForm, onLoadDemo }: LandingPageProps) {
  return (
    <div className="w-full">
      {/* Top Banner Context */}
      <div className="bg-emerald-900 text-emerald-100 py-2.5 px-4 text-center text-xs sm:text-sm font-medium border-b border-emerald-800">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2">
          <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">PM-AJAY GIA</span>
          <span>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana · Grants-in-Aid Component Livelihood Mapping Portal</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 lg:py-24 px-5 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_.9fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
              <Sparkles size={14} className="text-emerald-400" />
              <span>AI-Driven Multilingual Voice Assistant for SC Communities</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] font-serif">
              Speak your skills. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Unlock NSQF training & PM-AJAY livelihoods.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              Designed for Scheduled Caste (SC) beneficiaries under the Grants-in-Aid (GIA) component of PM-AJAY.
              No complex forms—simply talk in your local language to discover certified skill courses, toolkit grants, and sustainable earning opportunities.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <button
                onClick={onStartVoice}
                className="flex items-center gap-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-7 py-4 font-bold text-base transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
              >
                <Mic size={20} className="animate-pulse" />
                <span>Start Voice Assistant</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onOpenForm}
                className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-6 py-4 font-semibold text-sm transition-all"
              >
                <UserCheck size={18} />
                <span>Fill Form Manually</span>
              </button>
            </div>

            {/* Presets Demo Bar */}
            <div className="mt-10 pt-6 border-t border-slate-800">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                Quick Test Preset Beneficiaries (Hackathon Mode):
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_BENEFICIARIES.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => onLoadDemo(demo.profile)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-emerald-950/40 hover:border-emerald-500/50 px-3.5 py-2 text-xs text-slate-300 hover:text-emerald-300 font-medium transition-all"
                  >
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span>{demo.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="relative">
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200">PM-AJAY GIA Livelihood Engine</h3>
                    <p className="text-xs text-slate-400">NCVET NSQF Aligned Framework</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  Live AI
                </span>
              </div>

              <div className="space-y-4 py-6">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-800/60 p-4 border border-slate-800">
                  <div className="grid size-9 place-items-center rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs">
                    01
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-200">Voice Input in Indian Languages</p>
                    <p className="text-xs text-slate-400">English, Hindi, Telugu, Tamil, Marathi</p>
                  </div>
                  <Volume2 size={18} className="text-amber-400" />
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-800/60 p-4 border border-slate-800">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                    02
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-200">NSQF Qualification Match</p>
                    <p className="text-xs text-slate-400">QP Code & Skill Gap Identification</p>
                  </div>
                  <GraduationCap size={18} className="text-emerald-400" />
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-800/60 p-4 border border-slate-800">
                  <div className="grid size-9 place-items-center rounded-xl bg-teal-500/20 text-teal-300 font-bold text-xs">
                    03
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-200">PM-AJAY GIA Grant & Livelihood</p>
                    <p className="text-xs text-slate-400">Equipment Toolkit + Financial Subsidy</p>
                  </div>
                  <Briefcase size={18} className="text-teal-400" />
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-950 p-4 border border-emerald-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-200">Verified Ministry Dataset Architecture</p>
                    <p className="text-slate-400">Designed for Seamless PM-AJAY Integration</p>
                  </div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <BarChart3 size={14} /> Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="bg-slate-900 border-y border-slate-800 text-slate-200 py-10 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-emerald-400">18,450+</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">SC Beneficiaries Mapped</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-amber-400">₹9.42 Cr</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">PM-AJAY GIA Grant Support</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-teal-400">100%</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">NSQF Qualification Aligned</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-cyan-400">5 Languages</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">Voice Assistant Support</p>
          </div>
        </div>
      </section>

      {/* How it Works / Core Flow */}
      <section className="py-20 px-5 lg:px-8 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Simple 4-Step Process
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold font-serif">
              From voice interaction to sustainable livelihood.
            </h2>
            <p className="mt-3 text-slate-400 leading-relaxed">
              SakshamAI removes literacy and bureaucratic barriers for SC community members by converting spoken natural responses into structured career roadmaps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 font-bold">
                <Mic size={22} />
              </div>
              <h3 className="mt-6 text-xl font-bold font-serif text-slate-100">1. Speak Naturally</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Beneficiary speaks about their education, past work experience, and interests in their native language.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 grid place-items-center text-amber-400 font-bold">
                <Compass size={22} />
              </div>
              <h3 className="mt-6 text-xl font-bold font-serif text-slate-100">2. Skill Gap Mapping</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                AI extracts baseline skills, compares against sector standards, and calculates missing competencies.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="size-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 grid place-items-center text-teal-400 font-bold">
                <GraduationCap size={22} />
              </div>
              <h3 className="mt-6 text-xl font-bold font-serif text-slate-100">3. NSQF Recommendations</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Maps exact NSQF Qualification Packs (Levels 1-5) with certified duration, eligibility, and skill outcomes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="size-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 grid place-items-center text-cyan-400 font-bold">
                <Briefcase size={22} />
              </div>
              <h3 className="mt-6 text-xl font-bold font-serif text-slate-100">4. PM-AJAY GIA Grant</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Connects beneficiary to self-employment equipment toolkits, credit linkage, or direct job placement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
