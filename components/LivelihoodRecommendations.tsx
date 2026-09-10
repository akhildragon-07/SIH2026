'use client';

import React, { useState } from 'react';
import { LivelihoodOpportunity, LivelihoodType } from '@/lib/types';
import { Briefcase, Landmark, MapPin, IndianRupee, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Gift, Check, X, Clock, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import Image from 'next/image';
import CircularProgress from './ui/CircularProgress';

function getSectorImage(sector?: string, title?: string): string {
  const text = `${sector || ''} ${title || ''}`.toLowerCase();
  if (text.includes('tailor') || text.includes('apparel') || text.includes('garment') || text.includes('textile') || text.includes('sewing') || text.includes('fashion')) {
    return '/images/cat_tailoring_garment.jpg';
  }
  if (text.includes('solar') || text.includes('electric') || text.includes('wireman') || text.includes('energy') || text.includes('power')) {
    return '/images/cat_solar_electrical.jpg';
  }
  if (text.includes('agri') || text.includes('farm') || text.includes('crop') || text.includes('food') || text.includes('horticulture') || text.includes('organic') || text.includes('dairy') || text.includes('poultry')) {
    return '/images/cat_agriculture_farming.jpg';
  }
  if (text.includes('digit') || text.includes('it') || text.includes('comput') || text.includes('hardware') || text.includes('repair') || text.includes('electronics') || text.includes('mobile') || text.includes('telecom')) {
    return '/images/cat_digital_electronics.jpg';
  }
  return '/images/hero_saksham_guide.jpg';
}

interface LivelihoodProps {
  opportunities: LivelihoodOpportunity[];
  preferredCategory?: LivelihoodType;
}

export default function LivelihoodRecommendations({ opportunities, preferredCategory }: LivelihoodProps) {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [activeApplyingOpp, setActiveApplyingOpp] = useState<LivelihoodOpportunity | null>(null);

  const categories = ['All', 'Self-employment', 'Job', 'Entrepreneurship'];

  const filtered = selectedCategory === 'All'
    ? opportunities
    : opportunities.filter((o) => o.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleClaim = (id: string) => {
    setClaimedId(id);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>PM-AJAY GIA Grants & Livelihood Pathways</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Livelihood & Income Opportunities
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Personalized job placements, self-employment equipment toolkits, and micro-enterprises eligible for PM-AJAY GIA subsidies.
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
                {cat === 'Self-employment' ? '🛠️ Self-employment' : cat === 'Job' ? '💼 Jobs' : cat === 'Entrepreneurship' ? '🚀 Enterprise' : 'All'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filtered.map((opp) => {
          const isClaimed = claimedId === opp.id;
          const sectorImg = getSectorImage(opp.sector, opp.title);
          return (
            <div
              key={opp.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 transition-all hover:border-emerald-500/50 hover:bg-slate-900 shadow-xl space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden border border-slate-700 shrink-0 shadow-md">
                    <Image
                      src={sectorImg}
                      alt={opp.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
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

                {/* Match Score Circular Progress */}
                <div className="shrink-0 flex flex-col items-center">
                  <CircularProgress score={opp.matchScore || 85} size="sm" showLabel={true} showTierText={false} />
                  <span className="text-[10px] font-bold text-emerald-400 mt-1">Suitability</span>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-bold">Skills Alignment:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.requiredSkills.map((sk) => {
                      const isMatched = opp.matchingSkills?.some((m) => m.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(m.toLowerCase()));
                      return (
                        <span
                          key={sk}
                          className={`rounded-lg px-2.5 py-0.5 text-[11px] font-semibold border ${
                            isMatched
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {isMatched ? '✓ ' : ''}{sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setActiveApplyingOpp(opp)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isClaimed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>Application Submitted (Track Status)</span>
                    </>
                  ) : (
                    <>
                      <span>{opp.category === 'Self-employment' ? 'Claim PM-AJAY Toolkit Grant' : 'Apply for Opportunity'}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grant Application Modal */}
      {activeApplyingOpp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveApplyingOpp(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveApplyingOpp(null)}
              className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck size={14} />
                <span>PM-AJAY GIA Grant Application</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-slate-100">
                {activeApplyingOpp.title}
              </h3>
              <p className="text-xs text-slate-400">
                {activeApplyingOpp.sector} · Expected Income: <strong className="text-emerald-300">{activeApplyingOpp.incomeRange}</strong>
              </p>
            </div>

            {/* Application Overview Box */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subsidy Support</span>
                <span className="font-bold text-emerald-400">100% Capital Toolkit Subsidy</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Grant Deliverable</span>
                <p className="text-slate-200">{activeApplyingOpp.giaSupport || 'Complete professional equipment kit & direct MSME cluster linkage.'}</p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Nodal Officer Review Agency</span>
                <p className="text-slate-300">District Social Welfare Department & PM-AJAY GIA State Nodal Unit</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                By submitting, your verified beneficiary profile and mapped NSQF skills will be lodged directly to the District Welfare Officer for priority sanctioning.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveApplyingOpp(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  const oppId = activeApplyingOpp.id;
                  setClaimedId(oppId);
                  showToast({
                    type: 'grant',
                    title: 'Grant Application Lodged!',
                    description: `Application #GIA-2026-${oppId} submitted to District Officer.`
                  });
                  setActiveApplyingOpp(null);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <FileText size={14} />
                <span>Confirm & Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

