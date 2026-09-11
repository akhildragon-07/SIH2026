'use client';

import React, { useState } from 'react';
import { OpportunityMatchResult } from '@/lib/types';
import {
  MapPin,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  IndianRupee,
  Navigation,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Building,
  AlertCircle,
  X
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: OpportunityMatchResult;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function OpportunityCard({
  opportunity,
  isSelected = false,
  onSelect
}: OpportunityCardProps) {
  const [showExplainable, setShowExplainable] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Category styles
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'training':
        return {
          label: 'Training Center',
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
          icon: GraduationCap
        };
      case 'job':
        return {
          label: 'Wage Job',
          color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: Briefcase
        };
      case 'apprenticeship':
        return {
          label: 'Apprenticeship',
          color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          icon: Award
        };
      case 'livelihood':
      default:
        return {
          label: 'Livelihood / Enterprise',
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
          icon: Sparkles
        };
    }
  };

  const badgeInfo = getTypeBadge(opportunity.type);
  const TypeIcon = badgeInfo.icon;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${opportunity.latitude},${opportunity.longitude}`;

  return (
    <>
      <div
        onClick={onSelect}
        className={`group relative rounded-3xl border transition-all duration-300 p-5 sm:p-6 space-y-4 cursor-pointer ${
          isSelected
            ? 'border-emerald-500 bg-slate-900 shadow-2xl ring-2 ring-emerald-500/20'
            : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
        }`}
      >
        {/* Top Header: Badges, Match Score & Distance */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.color}`}
            >
              <span className={`size-2 rounded-full ${badgeInfo.dot}`} />
              <TypeIcon size={12} />
              <span>{badgeInfo.label}</span>
            </span>

            {opportunity.isDistrictMatch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <MapPin size={11} className="text-emerald-400" />
                <span>In Your District</span>
              </span>
            )}

            {opportunity.sector && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                {opportunity.sector}
              </span>
            )}

            {opportunity.nsqfLevel && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                NSQF L{opportunity.nsqfLevel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles size={12} className="text-emerald-400" />
              <span>{opportunity.matchScore}% Match</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <MapPin size={12} />
              <span>{opportunity.calculatedDistanceKm} km</span>
            </div>
          </div>
        </div>

        {/* Opportunity Title, Job Role & Provider */}
        <div>
          <h3 className="text-lg font-bold font-serif text-slate-100 group-hover:text-emerald-300 transition-colors leading-snug">
            {opportunity.name}
          </h3>
          {opportunity.jobRole && opportunity.jobRole !== opportunity.name && (
            <p className="text-xs font-semibold text-emerald-400/90 mt-0.5">
              Role: {opportunity.jobRole}
            </p>
          )}
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
            <Building size={13} className="text-slate-500 shrink-0" />
            <span className="truncate">{opportunity.provider || 'PM-AJAY Partner Organization'}</span>
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <MapPin size={13} className="text-slate-500 shrink-0" />
            <span>{opportunity.city ? `${opportunity.city}, ` : ''}{opportunity.district}, {opportunity.state}</span>
            <span className="text-[10px] text-slate-500 italic ml-1">(Approximate district location)</span>
          </p>
        </div>

        {/* Description */}
        {opportunity.description && (
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {opportunity.description}
          </p>
        )}

        {/* Required Skills Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
          {opportunity.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Key Info Strip: Income & Course Name */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          {opportunity.estimatedMonthlyIncome && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <IndianRupee size={14} className="text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Monthly</span>
                <span className="font-bold text-emerald-300">
                  ₹{opportunity.estimatedMonthlyIncome.toLocaleString()} / mo
                </span>
              </div>
            </div>
          )}

          {opportunity.educationRequired && (
            <div className="flex items-center gap-1.5 text-slate-300">
              <GraduationCap size={14} className="text-blue-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Min. Education</span>
                <span className="font-semibold text-slate-200">{opportunity.educationRequired}</span>
              </div>
            </div>
          )}
        </div>

        {/* Explainable AI ("Why recommended?") Toggle */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowExplainable(!showExplainable);
            }}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-400" />
              <span>Why is this recommended for you?</span>
            </span>
            {showExplainable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showExplainable && (
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs animate-in fade-in duration-200">
              {opportunity.explainableScore.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{reason}</span>
                </div>
              ))}

              {/* Multi-Factor Score Bars */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Job & Skill Match (40%):</span>
                  <span className="text-emerald-400 font-bold">{opportunity.explainableScore.skillMatchPct}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Education & NSQF (20%):</span>
                  <span className="text-cyan-400 font-bold">{opportunity.explainableScore.eligibilityMatchPct}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Experience Alignment (15%):</span>
                  <span className="text-teal-400 font-bold">{opportunity.explainableScore.goalMatchPct}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Interest Alignment (10%):</span>
                  <span className="text-purple-400 font-bold">{opportunity.explainableScore.nsqfMatchPct}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>District & Distance Proximity (15%):</span>
                  <span className="text-amber-400 font-bold">{opportunity.explainableScore.locationScorePct}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PM-AJAY / GIA Support Pathway Advisory */}
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/20 p-2.5 text-[11px] text-amber-300/90 leading-relaxed">
          <ShieldCheck size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <span>
            This opportunity may be relevant to a PM-AJAY/GIA livelihood-support pathway, subject to applicable eligibility and approval.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
          >
            <Info size={14} />
            <span>View Details</span>
          </button>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 text-xs font-bold transition-colors shadow-md"
          >
            <Navigation size={14} />
            <span>Get Directions</span>
          </a>
        </div>
      </div>

      {/* Full Opportunity Details Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.color}`}>
                  <TypeIcon size={12} />
                  <span>{badgeInfo.label}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {opportunity.matchScore}% Match for your profile
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  📍 {opportunity.calculatedDistanceKm} km away
                </span>
              </div>

              <h2 className="text-2xl font-bold font-serif text-slate-100">
                {opportunity.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {opportunity.provider} · {opportunity.city}, {opportunity.district}, {opportunity.state}
              </p>
            </div>

            {/* Core Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs">
              {opportunity.sector && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sector / Industry</span>
                  <span className="font-bold text-cyan-300">{opportunity.sector}</span>
                </div>
              )}
              {opportunity.jobRole && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Designated Job Role</span>
                  <span className="font-semibold text-emerald-300">{opportunity.jobRole}</span>
                </div>
              )}
              {opportunity.courseName && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">NSQF Qualification / Course</span>
                  <span className="font-bold text-emerald-300">{opportunity.courseName}</span>
                </div>
              )}
              {opportunity.nsqfLevel && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Accredited Level</span>
                  <span className="font-semibold text-slate-200">NSQF Level {opportunity.nsqfLevel} (NCVET Aligned)</span>
                </div>
              )}
              {opportunity.estimatedMonthlyIncome && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Earning Potential</span>
                  <span className="font-bold text-emerald-300">₹{opportunity.estimatedMonthlyIncome.toLocaleString()} / month</span>
                </div>
              )}
              {opportunity.educationRequired && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Minimum Educational Criteria</span>
                  <span className="font-semibold text-slate-200">{opportunity.educationRequired}</span>
                </div>
              )}
            </div>

            {/* Description & Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Description & Pathway
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {opportunity.description || 'Structured opportunity tailored for SC beneficiaries seeking certified skills and sustainable livelihood enhancement.'}
              </p>
            </div>

            {/* Eligibility Criteria */}
            {opportunity.eligibility && opportunity.eligibility.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Eligibility & Requirements
                </h4>
                <div className="grid gap-2">
                  {opportunity.eligibility.map((el, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Provider & Contact Details
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Building size={14} className="text-slate-400" />
                  <strong>{opportunity.provider}</strong>
                </p>
                {opportunity.address && (
                  <p className="flex items-center gap-2 text-slate-400">
                    <MapPin size={14} className="text-slate-500" />
                    <span>{opportunity.address}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-4 pt-1">
                  {opportunity.contactPhone && (
                    <a
                      href={`tel:${opportunity.contactPhone}`}
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
                    >
                      <Phone size={13} />
                      <span>{opportunity.contactPhone}</span>
                    </a>
                  )}
                  {opportunity.contactEmail && (
                    <a
                      href={`mailto:${opportunity.contactEmail}`}
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:underline"
                    >
                      <Mail size={13} />
                      <span>{opportunity.contactEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Watermark */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="italic">Demo Data — Replace with verified government/API data before deployment.</span>
              <span className="font-mono text-[10px] text-emerald-400">ID: {opportunity.id}</span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Close
              </button>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg"
              >
                <Navigation size={14} />
                <span>Open Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
