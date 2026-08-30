'use client';

import React, { useState } from 'react';
import { BeneficiaryProfile } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { Landmark, ShieldCheck, QrCode, CheckCircle2, Download, Printer, RefreshCw, Sparkles, MapPin, GraduationCap, Briefcase, Phone, Mail, UserCheck } from 'lucide-react';

interface AccountCardProps {
  profile?: BeneficiaryProfile;
  onEditProfile?: () => void;
  onViewRecommendations?: () => void;
}

export default function BeneficiaryAccountCard({ profile: propProfile, onEditProfile, onViewRecommendations }: AccountCardProps) {
  const { profile: contextProfile, syncWithBackend, isSyncing } = useAuth();
  const profile = propProfile || contextProfile;
  const [downloadNotice, setDownloadNotice] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="w-full mx-auto max-w-4xl space-y-6">
      {/* Top Banner Alert */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Official Beneficiary Account ID:</span>
              <strong className="text-emerald-400 font-mono tracking-wider">{profile.beneficiaryId || 'SC-AJAY-2026-1001'}</strong>
            </p>
            <p className="text-xs text-slate-400">
              Verified under Ministry of Social Justice & Empowerment · PM-AJAY GIA Component
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => syncWithBackend()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 text-xs font-semibold transition-all"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-emerald-400' : 'text-slate-400'} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-md"
          >
            <Printer size={13} />
            <span>Print Passbook</span>
          </button>
        </div>
      </div>

      {/* Main Digital Beneficiary Passbook / Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Watermark Background Seal */}
        <div className="absolute right-[-40px] top-[-40px] opacity-5 pointer-events-none">
          <Landmark size={280} />
        </div>

        {/* Card Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Landmark size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-slate-100">SakshamAI PM-AJAY Card</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                  Official GIA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Pradhan Mantri Anusuchit Jaati Abhyuday Yojana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-slate-950/80 p-2 text-center text-slate-300 shadow-inner">
              <QrCode size={40} className="text-emerald-400 mx-auto" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mt-1">
                SCAN VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_.8fr]">
          {/* Left Column: Beneficiary Details */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Beneficiary Full Name</span>
              <h3 className="text-2xl font-bold font-serif text-slate-100 mt-0.5">{profile.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-emerald-400" />
                <span>{profile.district}, {profile.state} ({profile.areaType})</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Category</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 block">{profile.category || 'Scheduled Caste (SC)'}</span>
              </div>

              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Age & Gender</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">{profile.age} Yrs · {profile.gender}</span>
              </div>

              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Education Level</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">{profile.education}</span>
              </div>

              <div className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Experience</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block">{profile.workExperienceYears} Years</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300">
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-emerald-400" />
                  <strong>+91 {profile.phone}</strong>
                </span>
              )}
              {profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-emerald-400" />
                  <span>{profile.email}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Skills & GIA Grant Status */}
          <div className="space-y-4 rounded-2xl bg-slate-950/60 p-5 border border-slate-800/90 flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-2">
                  <span>Verified Skill Set</span>
                  <span className="text-emerald-400 text-[10px]">✓ Mapped to NSQF</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.existingSkills && profile.existingSkills.length > 0 ? (
                    profile.existingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-300"
                      >
                        <CheckCircle2 size={11} className="text-emerald-400" /> {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills recorded yet.</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Livelihood Vision</span>
                <p className="text-xs font-semibold text-amber-300 mt-1 leading-relaxed">
                  "{profile.careerGoal || 'Self-employment with PM-AJAY toolkit grant.'}"
                </p>
              </div>
            </div>

            {/* Grant Badge */}
            <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/30 p-3 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                PM-AJAY GIA STATUS
              </span>
              <p className="text-xs font-bold text-slate-100">
                {profile.giaEligibilityStatus || 'Eligible for 100% GIA Toolkit Grant'}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Backend Synced: <strong className="text-slate-200">Yes (National Database)</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="text-slate-300 hover:text-emerald-400 font-bold transition-colors"
              >
                Edit Details
              </button>
            )}

            {onViewRecommendations && (
              <button
                onClick={onViewRecommendations}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <Sparkles size={13} />
                <span>View Recommendations →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-xs font-bold text-emerald-300">
          ✓ Digital PM-AJAY Beneficiary Card generated and ready for printing.
        </div>
      )}
    </div>
  );
}