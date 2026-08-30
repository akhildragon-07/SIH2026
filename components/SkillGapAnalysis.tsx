'use client';

import React from 'react';
import { SkillGapAnalysisResult } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Sparkles, Target, ArrowUpRight } from 'lucide-react';

interface SkillGapProps {
  skillGap: SkillGapAnalysisResult;
}

export default function SkillGapAnalysis({ skillGap }: SkillGapProps) {
  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>AI Skill Gap Diagnostic</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold font-serif text-slate-100">
            Skill Alignment & Gap Mapping
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Target Role: <span className="text-emerald-300 font-semibold">{skillGap.targetOccupation}</span>
          </p>
        </div>

        {/* Readiness Index Metric */}
        <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Skilling Readiness</p>
            <p className="text-2xl font-bold font-serif text-emerald-400">{skillGap.skillingReadinessIndex}%</p>
          </div>
          <div className="size-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 grid place-items-center text-emerald-400 font-bold text-xs">
            {skillGap.overallMatchPercentage}%
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Existing Skills */}
        <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle2 size={16} />
            <span>Existing Skills (Verified Baseline)</span>
          </p>

          <div className="flex flex-wrap gap-2">
            {skillGap.existingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-300"
              >
                <CheckCircle2 size={13} />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills / Gaps */}
        <div className="rounded-2xl bg-slate-950/60 p-5 border border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
            <AlertTriangle size={16} />
            <span>Missing Skills to Learn (Priority Gaps)</span>
          </p>

          <div className="space-y-2">
            {skillGap.missingSkills.map((gap) => (
              <div
                key={gap.skillName}
                className="flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800 text-xs"
              >
                <span className="font-semibold text-slate-200">{gap.skillName}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    gap.importance === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {gap.importance} Focus
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Focus Callout */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-950 p-4 border border-emerald-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Target size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Top Priority Training Intervention</p>
            <p className="text-sm font-bold text-slate-100">{skillGap.prioritySkillingArea}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-400 hidden sm:block">
          Included in Recommended NSQF Modules
        </span>
      </div>
    </div>
  );
}
