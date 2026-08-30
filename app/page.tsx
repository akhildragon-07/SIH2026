'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import LandingPage from '@/components/LandingPage';
import DemoBeneficiarySelector from '@/components/DemoBeneficiarySelector';
import ProfileOnboardingChoice from '@/components/ProfileOnboardingChoice';
import VoiceAssistant from '@/components/VoiceAssistant';
import TextOnboardingBot from '@/components/TextOnboardingBot';
import BeneficiaryOnboarding from '@/components/BeneficiaryOnboarding';
import ProfileConfirmation from '@/components/ProfileConfirmation';
import BeneficiaryDashboard from '@/components/BeneficiaryDashboard';
import SkillGapAnalysis from '@/components/SkillGapAnalysis';
import NSQFRecommendations from '@/components/NSQFRecommendations';
import LivelihoodRecommendations from '@/components/LivelihoodRecommendations';
import CareerRoadmap from '@/components/CareerRoadmap';
import AdminDashboard from '@/components/AdminDashboard';

import { BeneficiaryProfile, AnalysisResponse } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';
import { Landmark, Mic, UserCheck, GraduationCap, Briefcase, BarChart3, Sparkles, LayoutDashboard, ShieldCheck, CheckCircle2 } from 'lucide-react';

type ViewMode = 'landing' | 'onboard-choice' | 'voice' | 'text' | 'manual' | 'confirm' | 'dashboard' | 'results' | 'admin';

function MainAppContent() {
  const { profile, updateProfile } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeDemoId, setActiveDemoId] = useState<string | undefined>('demo-ravi');

  // Pending profile for confirmation step
  const [pendingProfile, setPendingProfile] = useState<BeneficiaryProfile>(profile);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeResultsTab, setActiveResultsTab] = useState<'nsqf' | 'livelihood' | 'roadmap' | 'gap'>('nsqf');

  const fetchAnalysis = async (profileToAnalyze: BeneficiaryProfile) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileToAnalyze })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisResult(json.data);
      }
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(profile);
  }, []);

  // Demo selector handler
  const handleSelectDemoProfile = (demoProf: BeneficiaryProfile) => {
    setPendingProfile(demoProf);
    updateProfile(demoProf);
    setActiveDemoId(demoProf.id);
    fetchAnalysis(demoProf);
    setCurrentView('results');
  };

  // Step 1: User completes Voice/Text/Manual -> goes to Confirmation Step
  const handleOnboardingDataExtracted = (extracted: Partial<BeneficiaryProfile>) => {
    const fullPending: BeneficiaryProfile = {
      ...profile,
      ...extracted,
      name: extracted.name || profile.name || 'Ravi',
      education: extracted.education || profile.education || '10th Pass',
      existingSkills: extracted.existingSkills && extracted.existingSkills.length > 0 ? extracted.existingSkills : ['Tailoring', 'Sewing', 'Stitching']
    };
    setPendingProfile(fullPending);
    setCurrentView('confirm');
  };

  // Step 2: User confirms profile on "Here is what we understood about you" page
  const handleConfirmProfile = () => {
    updateProfile(pendingProfile);
    fetchAnalysis(pendingProfile);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Hackathon Demo Preset Bar */}
      <DemoBeneficiarySelector
        onSelectProfile={handleSelectDemoProfile}
        activeDemoId={activeDemoId}
      />

      {/* Main Government Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Landmark size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-slate-100">SakshamAI</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                  PM-AJAY GIA
                </span>
              </div>
              <span className="block text-[11px] font-semibold text-slate-400">
                Voice Assistant & Official NSQF Livelihood Mapping
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'landing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('onboard-choice')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'onboard-choice' || currentView === 'voice' || currentView === 'text' || currentView === 'manual'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck size={14} />
              <span>Create Profile</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'dashboard' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentView('results')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'results' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap size={14} />
              <span>Recommendations</span>
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                currentView === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 size={14} className="text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('onboard-choice')}
              className="flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-md"
            >
              <Mic size={14} />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Views */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartVoice={() => setCurrentView('voice')}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenForm={() => setCurrentView('onboard-choice')}
            onLoadDemo={handleSelectDemoProfile}
          />
        )}

        {currentView === 'onboard-choice' && (
          <ProfileOnboardingChoice
            onSelectMethod={(method) => {
              if (method === 'voice') setCurrentView('voice');
              else if (method === 'text') setCurrentView('text');
              else setCurrentView('manual');
            }}
          />
        )}

        {currentView === 'voice' && (
          <VoiceAssistant
            currentProfile={pendingProfile}
            onProfileUpdated={(updated) => setPendingProfile((prev) => ({ ...prev, ...updated }))}
            onGeneratePlan={() => setCurrentView('confirm')}
          />
        )}

        {currentView === 'text' && (
          <TextOnboardingBot
            onCompleteTextOnboarding={handleOnboardingDataExtracted}
          />
        )}

        {currentView === 'manual' && (
          <BeneficiaryOnboarding
            initialProfile={pendingProfile}
            onSubmitProfile={(prof) => {
              setPendingProfile(prof);
              setCurrentView('confirm');
            }}
          />
        )}

        {currentView === 'confirm' && (
          <ProfileConfirmation
            profile={pendingProfile}
            onConfirm={handleConfirmProfile}
            onEdit={() => setCurrentView('manual')}
          />
        )}

        {currentView === 'dashboard' && (
          <BeneficiaryDashboard
            onEditProfile={() => setCurrentView('manual')}
            onOpenVoiceAI={() => setCurrentView('voice')}
          />
        )}

        {currentView === 'results' && (
          <div className="w-full mx-auto max-w-7xl px-4 py-8 space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <Sparkles size={13} />
                  <span>Personalized PM-AJAY Livelihood Plan</span>
                </div>
                <h1 className="mt-2 text-3xl font-bold font-serif text-slate-100">
                  Livelihood & Skilling Plan for {profile.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                  <span>Location: <strong className="text-slate-200">{profile.district}, {profile.state}</strong></span>
                  <span>Education: <strong className="text-slate-200">{profile.education}</strong></span>
                  <span>Goal: <strong className="text-amber-400">{profile.preferredLivelihood}</strong></span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('manual')}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-300 hover:border-slate-700"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setCurrentView('voice')}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs font-bold hover:bg-emerald-400"
                >
                  <Mic size={14} /> Voice Assistant
                </button>
              </div>
            </div>

            {/* Results Navigation Tabs */}
            <div className="flex gap-3 overflow-x-auto border-b border-slate-800 pb-2">
              {[
                { id: 'nsqf', label: 'NSQF Training Courses', icon: GraduationCap },
                { id: 'livelihood', label: 'Livelihood & GIA Grants', icon: Briefcase },
                { id: 'roadmap', label: 'Career Roadmap', icon: Sparkles },
                { id: 'gap', label: 'Skill Gap Analysis', icon: CheckCircle2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeResultsTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveResultsTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {isAnalyzing || !analysisResult ? (
              <div className="py-20 text-center text-slate-400">
                <Sparkles className="animate-spin mx-auto text-emerald-400 mb-3" size={28} />
                <p className="font-bold text-slate-200">Calculating NSQF alignment & official government URLs...</p>
              </div>
            ) : (
              <div>
                {activeResultsTab === 'nsqf' && (
                  <NSQFRecommendations courses={analysisResult.nsqfRecommendations} />
                )}

                {activeResultsTab === 'livelihood' && (
                  <LivelihoodRecommendations
                    opportunities={analysisResult.livelihoodRecommendations}
                    preferredCategory={profile.preferredLivelihood}
                  />
                )}

                {activeResultsTab === 'roadmap' && (
                  <CareerRoadmap
                    steps={analysisResult.careerRoadmap}
                    beneficiaryName={profile.name}
                  />
                )}

                {activeResultsTab === 'gap' && (
                  <SkillGapAnalysis skillGap={analysisResult.skillGap} />
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-bold">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>SakshamAI · PM-AJAY Grants-in-Aid (GIA) Component Public Service Portal</span>
        </div>
        <p>
          Official Qualification References: <a href="https://nqr.gov.in/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">National Qualifications Register (NQR)</a> · <a href="https://www.nielit.in/content/nsqf" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">NIELIT NSQF Portal</a>
        </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
