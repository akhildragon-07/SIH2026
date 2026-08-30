'use client';

import React, { useState } from 'react';
import { LivelihoodOpportunity, LivelihoodType } from '@/lib/types';
import { Briefcase, Landmark, MapPin, IndianRupee, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Gift } from 'lucide-react';

interface LivelihoodProps {
  opportunities: LivelihoodOpportunity[];
  preferredCategory?: LivelihoodType;
}

export default function LivelihoodRecommendations({ opportunities, preferredCategory }: LivelihoodProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Self-employment', 'Job', 'Entrepreneurship'];

  const filtered = selectedCategory === 'All'
    ? opportunities
    : opportunities.filter((o) => o.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>PM-AJAY GIA Grants & Livelihood Pathways</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Livelihood & Income Opportunities
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Personalized job placements, self-employment toolkits, and micro-enterprises eligible for PM-AJAY GIA subsidies.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-900 p-1.5 border border-slate-800">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 transition-all hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Briefcase size={22} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300 border border-slate-700">
                      {opp.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">{opp.sector}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-100 mt-2">
                    {opp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-emerald-400" /> {opp.location}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300 font-bold">
                      <IndianRupee size={14} /> {opp.incomeRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-extrabold text-emerald-400 border border-emerald-500/20">
                  {opp.matchScore}% Suitability Match
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{opp.description}</p>

            {/* PM-AJAY GIA Support Callout Highlight */}
            {opp.giaSupport && (
              <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-950 p-4 border border-amber-500/40 flex items-start gap-3">
                <div className="grid size-9 place-items-center rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Gift size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    PM-AJAY GIA Beneficiary Grant Benefit
                  </p>
                  <p className="text-xs font-medium text-amber-200 mt-1 leading-relaxed">
                    {opp.giaSupport}
                  </p>
                </div>
              </div>
            )}

            {/* Footer Required Skills & Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {opp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-slate-950 px-2.5 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all shadow-md">
                <span>Apply / Claim GIA Toolkit</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
