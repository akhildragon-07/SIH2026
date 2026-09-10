'use client';

import React from 'react';
import { X, GraduationCap, Clock, Award, CheckCircle2, Building, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export interface NSQFPathwayNodeData {
  levelTitle: string;
  nsqfLevel: number | string;
  courseName: string;
  duration: string;
  skillsGained: string[];
  eligibility: string;
  provider: string;
  certification: string;
  giaToolkitAssistance?: string;
  officialNqrUrl?: string;
}

interface NSQFPathwayModalProps {
  nodeData: NSQFPathwayNodeData | null;
  onClose: () => void;
  onSelectAction?: () => void;
}

export default function NSQFPathwayModal({
  nodeData,
  onClose,
  onSelectAction
}: NSQFPathwayModalProps) {
  if (!nodeData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <GraduationCap size={14} />
              <span>NSQF Level {nodeData.nsqfLevel}</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              NCVET Certified
            </span>
          </div>

          <h2 className="text-2xl font-bold font-serif text-slate-100">
            {nodeData.courseName}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {nodeData.levelTitle}  Accredited National Qualification Pathway
          </p>
        </div>

        {/* Core Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Clock size={12} className="text-emerald-400" /> Training Duration
            </span>
            <p className="font-bold text-slate-100">{nodeData.duration}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Award size={12} className="text-amber-400" /> Certification Body
            </span>
            <p className="font-bold text-slate-100">{nodeData.certification}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Building size={12} className="text-teal-400" /> Training Center / Provider
            </span>
            <p className="font-bold text-slate-100">{nodeData.provider}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <ShieldCheck size={12} className="text-cyan-400" /> Minimum Eligibility
            </span>
            <p className="font-bold text-slate-100">{nodeData.eligibility}</p>
          </div>
        </div>

        {/* Competencies Gained */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Key Competencies & Practical Skills Gained
          </h4>
          <div className="grid sm:grid-cols-2 gap-2">
            {nodeData.skillsGained.map((sk, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>{sk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GIA Grant Toolkit Callout */}
        {nodeData.giaToolkitAssistance && (
          <div className="rounded-2xl bg-amber-950/40 border border-amber-500/40 p-4 flex items-start gap-3">
            <ShieldCheck size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-amber-300 uppercase tracking-wider">
                PM-AJAY GIA Grant Support for this Level:
              </p>
              <p className="text-amber-200/90 leading-relaxed">
                {nodeData.giaToolkitAssistance}
              </p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Close
          </button>

          {nodeData.officialNqrUrl && (
            <a
              href={nodeData.officialNqrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-300 text-xs font-bold transition-colors"
            >
              <span>View Official NQR File</span>
              <ExternalLink size={13} />
            </a>
          )}

          {onSelectAction && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectAction();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <span>Enroll in NSQF Module</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
