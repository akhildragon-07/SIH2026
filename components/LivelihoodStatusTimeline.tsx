'use client';

import React from 'react';
import { UserCheck, Sparkles, MapPin, Send, Clock, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

interface TimelineProps {
  currentStageIndex?: number; // 0 to 5
  beneficiaryId?: string;
  applicationDate?: string;
}

const TIMELINE_STAGES = [
  {
    step: 1,
    title: 'Profile Created',
    status: 'Verified',
    date: '10 Sep 2026',
    desc: 'Voice diagnostic completed & bio data authenticated',
    icon: UserCheck
  },
  {
    step: 2,
    title: 'AI Assessment',
    status: 'Completed',
    date: '10 Sep 2026',
    desc: 'NSQF gap diagnostics & eligibility scoring computed',
    icon: Sparkles
  },
  {
    step: 3,
    title: 'Opportunity Matched',
    status: 'Matched',
    date: '10 Sep 2026',
    desc: 'Local training centers & GIA toolkit units identified',
    icon: MapPin
  },
  {
    step: 4,
    title: 'Application Submitted',
    status: 'Submitted',
    date: '10 Sep 2026',
    desc: 'PM-AJAY GIA grant toolkit application lodged to District Nodal Officer',
    icon: Send
  },
  {
    step: 5,
    title: 'Under Review',
    status: 'In Progress',
    date: 'Est. 3-5 days',
    desc: 'District Social Welfare Officer verification & fund allocation',
    icon: Clock
  },
  {
    step: 6,
    title: 'Approved & Sanctioned',
    status: 'Pending Sanction',
    date: 'Est. 18 Sep 2026',
    desc: '100% equipment grant disbursal & training center seat confirmation',
    icon: CheckCircle2
  }
];

export default function LivelihoodStatusTimeline({
  currentStageIndex = 3,
  beneficiaryId = 'SC-AJAY-2026-1001',
  applicationDate = '10 Sep 2026'
}: TimelineProps) {
  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            <ShieldCheck size={14} />
            <span>PM-AJAY GIA Livelihood Grant Tracker</span>
          </div>
          <h3 className="mt-2 text-xl sm:text-2xl font-bold font-serif text-slate-100">
            Application & Grant Status Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tracking ID: <strong className="text-emerald-400 font-mono">{beneficiaryId}</strong>  Submitted on {applicationDate}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Stage {currentStageIndex + 1} of 6: {TIMELINE_STAGES[currentStageIndex]?.title}</span>
        </div>
      </div>

      {/* Responsive Horizontal / Vertical Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
        {TIMELINE_STAGES.map((stage, idx) => {
          const isPassed = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isUpcoming = idx > currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.step}
              className={`relative rounded-2xl p-4 border flex flex-col justify-between space-y-3 transition-all duration-300 ${
                isCurrent
                  ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                  : isPassed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`size-8 rounded-xl grid place-items-center text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isPassed
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-amber-500/20 text-amber-300 font-extrabold animate-pulse'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-100 mt-3">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {stage.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{stage.date}</span>
                <span className="font-bold">{stage.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
