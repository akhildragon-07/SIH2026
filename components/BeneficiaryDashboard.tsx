'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { NSQF_COURSES_DATASET } from '@/lib/nsqf-data';
import {
  UserCheck,
  GraduationCap,
  Bookmark,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Edit3,
  CreditCard,
  MapPin,
  Clock
} from 'lucide-react';
import NSQFRecommendations from './NSQFRecommendations';
import SkillGapAnalysis from './SkillGapAnalysis';
import CareerRoadmap from './CareerRoadmap';
import BeneficiaryAccountCard from './BeneficiaryAccountCard';
import OpportunityMap from './OpportunityMap';
import LivelihoodStatusTimeline from './LivelihoodStatusTimeline';
import { analyzeBeneficiaryProfile } from '@/lib/ai-engine';

interface DashboardProps {
  onEditProfile: () => void;
  onOpenVoiceAI: () => void;
}

export default function BeneficiaryDashboard({ onEditProfile, onOpenVoiceAI }: DashboardProps) {
  const { user, profile, savedCourseIds } = useAuth();
  const [activeTab, setActiveTab] = useState<'card' | 'opportunities' | 'recommended' | 'gaps' | 'roadmap' | 'timeline' | 'saved'>('card');

  const analysis = analyzeBeneficiaryProfile(profile);
  const savedCourses = NSQF_COURSES_DATASET.filter((c) => savedCourseIds.includes(c.id));

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={14} />
            <span>Beneficiary Livelihood Dashboard</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Welcome, {profile.name}!
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
            <span>Beneficiary ID: <strong className="text-emerald-400 font-mono">{profile.beneficiaryId || 'SC-AJAY-2026-1001'}</strong></span>
            <span>Location: <strong className="text-slate-200">{profile.district}, {profile.state}</strong></span>
            <span>Education: <strong className="text-slate-200">{profile.education}</strong></span>
            <span>Goal: <strong className="text-amber-400">{profile.preferredLivelihood}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-slate-700"
          >
            <Edit3 size={14} /> Edit Profile
          </button>

          <button
            onClick={onOpenVoiceAI}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs font-bold hover:bg-emerald-400 shadow-md"
          >
            <Sparkles size={14} /> Voice Assistant
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Status</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold font-serif text-emerald-400">Verified</p>
            <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Nearby Opportunities</p>
          <p className="text-2xl font-bold font-serif text-teal-400">6+ Mapped</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Mapped Skills</p>
          <p className="text-2xl font-bold font-serif text-amber-400">{profile.existingSkills?.length || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">PM-AJAY GIA Grant</p>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <ShieldCheck size={12} /> Toolkit Eligible
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto border-b border-slate-800 pb-2">
        {[
          { id: 'card', label: 'PM-AJAY Digital ID Card', icon: CreditCard },
          { id: 'timeline', label: 'Grant Status Tracker', icon: Clock },
          { id: 'opportunities', label: 'Opportunities Near Me', icon: MapPin },
          { id: 'recommended', label: 'Recommended NSQF Courses', icon: GraduationCap },
          { id: 'gaps', label: 'Skill Gap Diagnostics', icon: AlertTriangle },
          { id: 'roadmap', label: 'Career Roadmap', icon: Sparkles },
          { id: 'saved', label: `Saved Courses (${savedCourses.length})`, icon: Bookmark }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'card' && (
          <BeneficiaryAccountCard
            profile={profile}
            onEditProfile={onEditProfile}
            onViewRecommendations={() => setActiveTab('opportunities')}
          />
        )}

        {activeTab === 'timeline' && (
          <LivelihoodStatusTimeline
            beneficiaryId={profile.beneficiaryId || 'SC-AJAY-2026-1001'}
            currentStageIndex={3}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityMap
            profile={profile}
            nsqfRecommendations={analysis.nsqfRecommendations}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'recommended' && (
          <NSQFRecommendations courses={analysis.nsqfRecommendations} />
        )}

        {activeTab === 'gaps' && (
          <SkillGapAnalysis skillGap={analysis.skillGap} />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmap
            steps={analysis.careerRoadmap}
            beneficiaryName={profile.name}
            onFindOpportunities={() => setActiveTab('opportunities')}
          />
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedCourses.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
                <Bookmark className="mx-auto text-slate-600 mb-2" size={32} />
                <p className="font-bold text-slate-200">No saved courses yet.</p>
                <p className="text-xs text-slate-500 mt-1">Browse recommended NSQF courses and bookmark your favorites!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedCourses.map((c) => (
                  <div key={c.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-emerald-400">
                        <span>NSQF Level {c.nsqfLevel}</span>
                        <span>QP Code: {c.qpCode}</span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-slate-100 mt-2">{c.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{c.sector} · {c.durationText}</p>
                    </div>

                    <a
                      href={c.officialCourseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-bold transition-all shadow-md"
                    >
                      <span>Visit Official Government Site</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
