'use client';

import React from 'react';
import { BeneficiaryProfile } from '@/lib/types';
import { Sparkles, CheckCircle2, Edit3, ArrowRight, UserCheck, ShieldCheck, MapPin, Briefcase, GraduationCap, Phone } from 'lucide-react';

interface ConfirmProps {
  profile: BeneficiaryProfile;
  onConfirm: () => void;
  onEdit: () => void;
}

export default function ProfileConfirmation({ profile, onConfirm, onEdit }: ConfirmProps) {
  return (
    <div className="w-full mx-auto max-w-3xl px-4 py-8">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} />
          <span>PM-AJAY Beneficiary Profile Verification</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold font-serif text-slate-100">
          Here is what we understood about you.
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your extracted beneficiary details before generating NSQF recommendations and PM-AJAY GIA grant matching.
        </p>
      </div>

      <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header Card */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <UserCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-slate-100">{profile.name}</h2>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {profile.beneficiaryId || 'SC-AJAY-2026-1001'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin size={13} className="text-emerald-400" />
                {profile.district}, {profile.state} ({profile.areaType})
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            {profile.age} Yrs · {profile.gender}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
              <MapPin size={15} className="text-emerald-400" /> State & District
            </p>
            <p className="text-base font-bold text-slate-100">{profile.district}, {profile.state}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
              <GraduationCap size={15} className="text-emerald-400" /> Education Level
            </p>
            <p className="text-base font-bold text-slate-100">{profile.education}</p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
              <Briefcase size={15} className="text-amber-400" /> Current Occupation & Experience
            </p>
            <p className="text-base font-bold text-slate-100">
              {profile.currentOccupation} ({profile.workExperienceYears} yrs exp)
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1">
              <Sparkles size={15} className="text-teal-400" /> Target Interest / Sector
            </p>
            <p className="text-base font-bold text-slate-100">
              {profile.interests && profile.interests.length > 0 ? profile.interests.join(', ') : 'All PM-AJAY Sectors'}
            </p>
          </div>

          <div className="sm:col-span-2 rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-2">Verified Existing Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.existingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300"
                >
                  <CheckCircle2 size={13} /> {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 rounded-2xl bg-slate-950/60 p-4 border border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-1">Career Goal & Preferred Livelihood</p>
            <p className="text-sm font-bold text-amber-300">
              {profile.preferredLivelihood}: "{profile.careerGoal}"
            </p>
          </div>
        </div>

        {/* Confirmation Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 font-bold text-sm transition-all shadow-xl"
          >
            <span>Confirm Profile & Issue Digital Passbook</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 px-6 py-4 font-semibold text-sm transition-all"
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

