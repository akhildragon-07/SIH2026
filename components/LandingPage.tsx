'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  ChevronRight,
  Compass,
  GraduationCap,
  Landmark,
  Mic,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Volume2,
  MapPin,
  CheckCircle2,
  Play,
  Award,
  Zap,
  Check,
  Layers,
  PhoneCall,
  Wrench,
  Sun,
  Scissors,
  Sprout,
  Cpu,
  ExternalLink
} from 'lucide-react';
import { BeneficiaryProfile } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';
import AnimatedCounter from './ui/AnimatedCounter';
import AiOrb from './ui/AiOrb';

interface LandingPageProps {
  onStartVoice: () => void;
  onOpenAdmin: () => void;
  onOpenForm: () => void;
  onLoadDemo: (profile: BeneficiaryProfile) => void;
  onOpenMap?: () => void;
}

interface LivelihoodCategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  icon: any;
  income: string;
  grantSupport: string;
  nsqfLevel: number;
  popularCourse: string;
  color: string;
}

const CATEGORY_ITEMS: LivelihoodCategoryItem[] = [
  {
    id: 'tailoring',
    title: 'Tailoring & Garments',
    subtitle: 'Apparel & Fashion Design',
    image: '/images/cat_tailoring_garment.jpg',
    icon: Scissors,
    income: '₹14,000 – ₹28,000 / mo',
    grantSupport: '100% Free GIA Sewing Machine & Toolkit',
    nsqfLevel: 4,
    popularCourse: 'Self-Employed Tailor (AMH/Q1947)',
    color: 'from-emerald-500/20 to-teal-500/10'
  },
  {
    id: 'solar',
    title: 'Solar & Clean Energy',
    subtitle: 'Green Jobs & Electricals',
    image: '/images/cat_solar_electrical.jpg',
    icon: Sun,
    income: '₹18,000 – ₹32,000 / mo',
    grantSupport: 'PM-AJAY Toolset Allowance & Subsidy',
    nsqfLevel: 4,
    popularCourse: 'Suryamitra Solar PV Installer (SGJ/Q0101)',
    color: 'from-amber-500/20 to-orange-500/10'
  },
  {
    id: 'agriculture',
    title: 'Organic Farming & Agro',
    subtitle: 'Agriculture & Horticulture',
    image: '/images/cat_agriculture_farming.jpg',
    icon: Sprout,
    income: '₹16,000 – ₹30,000 / mo',
    grantSupport: 'Bio-Fertilizer & Drip Kit GIA Grant',
    nsqfLevel: 4,
    popularCourse: 'Organic Grower & Composter (AGR/Q1201)',
    color: 'from-emerald-500/20 to-green-500/10'
  },
  {
    id: 'digital',
    title: 'Digital Services & Repair',
    subtitle: 'IT, Electronics & CSC Center',
    image: '/images/cat_digital_electronics.jpg',
    icon: Cpu,
    income: '₹15,000 – ₹30,000 / mo',
    grantSupport: 'CSC Hardware Toolkit & NIELIT Cert',
    nsqfLevel: 4,
    popularCourse: 'Smartphone Hardware Technician (ELE/Q8104)',
    color: 'from-cyan-500/20 to-blue-500/10'
  }
];

export default function LandingPage({
  onStartVoice,
  onOpenAdmin,
  onOpenForm,
  onLoadDemo,
  onOpenMap
}: LandingPageProps) {
  const [activeStoryStep, setActiveStoryStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<LivelihoodCategoryItem | null>(null);

  return (
    <div className="w-full relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Banner Context */}
      <div className="bg-emerald-950/90 text-emerald-200 py-2.5 px-4 text-center text-xs font-medium border-b border-emerald-800/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
            PM-AJAY GIA Component
          </span>
          <span>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana — Grants-in-Aid Livelihood Mapping Portal</span>
        </div>
      </div>

      {/* Hero Section with Gemini-Generated Art & Ambient Dynamics */}
      <section className="relative overflow-hidden py-12 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        {/* Animated Background Glow Blobs */}
        <div className="absolute top-1/4 left-10 size-72 sm:size-96 rounded-full bg-emerald-500/15 blur-3xl animate-blob pointer-events-none" />
        <div className="absolute top-1/3 right-10 size-80 sm:size-[420px] rounded-full bg-teal-500/15 blur-3xl animate-blob-reverse pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 size-72 rounded-full bg-amber-500/10 blur-3xl animate-blob-slow pointer-events-none" />

        {/* Subtle Tech Grid Pattern */}
        <div className="absolute inset-0 bg-grid-tech opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_.9fr] items-center">
          {/* Left Column: Hero Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-sm">
              <Sparkles size={14} className="text-emerald-400 animate-spin-slow" />
              <span>Voice-First Multilingual AI Livelihood Assistant · 7 Indian Languages</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] font-serif text-slate-100">
              Discover Your Verified <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Livelihood & GIA Grant
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              SakshamAI guides beneficiaries through conversational speech in their native language—mapping qualifications to official NSQF certified training, ₹50,000 toolset grants, and localized opportunities.
            </p>

            {/* Primary Actions */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={onStartVoice}
                className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-8 py-4 font-bold text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.03] cursor-pointer"
              >
                <Mic size={20} className="group-hover:scale-110 transition-transform animate-pulse" />
                <span>Start with Voice Guide</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {onOpenMap && (
                <button
                  onClick={onOpenMap}
                  className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200 px-6 py-4 font-semibold text-sm transition-all hover:scale-[1.02] backdrop-blur-md cursor-pointer"
                >
                  <MapPin size={18} className="text-emerald-400" />
                  <span>Explore Opportunity Map</span>
                </button>
              )}
            </div>

            {/* Hackathon Preset Beneficiaries Quick Test */}
            <div className="pt-6 border-t border-slate-800/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                <span>Instant Demo Beneficiaries (Pre-Loaded Profiles):</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_BENEFICIARIES.map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => onLoadDemo(demo.profile)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-emerald-950/40 hover:border-emerald-500/50 px-3.5 py-2 text-xs text-slate-300 hover:text-emerald-300 font-medium transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span>{demo.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset + Interactive AiOrb Showcase */}
          <div className="relative group">
            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-xl space-y-4 overflow-hidden">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">SakshamAI Multilingual Guide</h3>
                    <p className="text-[11px] text-emerald-400 font-semibold">PM-AJAY GIA · Ministry Aligned</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Voice
                </span>
              </div>

              {/* Gemini Generated Hero Image with Floating Hover Effect */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700/60 group-hover:border-emerald-500/40 transition-colors shadow-inner">
                <Image
                  src="/images/hero_saksham_guide.jpg"
                  alt="SakshamAI Voice Assistant helping Indian beneficiaries in community center"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Floating Micro Badge 1 */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-[11px] font-bold text-emerald-300 shadow-lg">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>100% Free GIA Grant</span>
                </div>

                {/* Floating Micro Badge 2 */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-lg">
                  <Award size={13} className="text-amber-400" />
                  <span>NSQF Levels 1-5 Certified</span>
                </div>
              </div>

              {/* Quick Spoken Voice Features */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold block text-sm">7</span>
                  <span className="text-[10px] text-slate-400">Languages</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-amber-400 font-bold block text-sm">₹50,000</span>
                  <span className="text-[10px] text-slate-400">Toolkit Grant</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-teal-400 font-bold block text-sm">1-by-1</span>
                  <span className="text-[10px] text-slate-400">Voice Guided</span>
                </div>
              </div>

              <button
                onClick={onStartVoice}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 py-3 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Mic size={15} />
                <span>Talk to SakshamAI Now</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="bg-slate-900/90 border-b border-slate-800 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-emerald-400">
              <AnimatedCounter end={18450} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">Beneficiaries Registered</p>
            <p className="text-[11px] text-slate-500 mt-0.5">PM-AJAY GIA Component</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition-colors">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-amber-400">
              <AnimatedCounter end={540} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">Verified Opportunities</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Training Centers & Nodal Offices</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 transition-colors">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-teal-400">
              <AnimatedCounter end={128} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">NSQF Certified Courses</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Government NCVET Aligned</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <p className="text-3xl sm:text-4xl font-bold font-serif text-cyan-400">
              <AnimatedCounter end={99} suffix="%" />
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-300">AI Match Precision</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Education & Skill Scoring</p>
          </div>
        </div>
      </section>

      {/* 4-Stage Panoramic Storytelling Journey Banner */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
              4-Stage Empowerment Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              From Spoken Voice to Sustainable Micro-Enterprise
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              How SakshamAI guides SC community members through every milestone of the government livelihood pathway.
            </p>
          </div>

          {/* Panoramic Visual Banner */}
          <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
            <Image
              src="/images/story_training_livelihood.jpg"
              alt="4-Stage Livelihood Journey: Voice Guidance, Skill Acquisition, Official Support, Flourishing Business"
              fill
              className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs">
              <span className="font-semibold text-slate-200">
                Official PM-AJAY GIA Grant & Certified Training Roadmap
              </span>
              <button
                onClick={onStartVoice}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Start Your Journey</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Interactive 4-Step Milestone Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Voice Self-Discovery',
                desc: 'Beneficiary speaks their background, education, and trade skills naturally in their mother tongue.',
                icon: Mic,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10'
              },
              {
                step: '02',
                title: 'Skill Gap Alignment',
                desc: 'AI extracts verified proficiencies, highlights gap areas, and matches official NSQF qualification courses.',
                icon: Compass,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10'
              },
              {
                step: '03',
                title: 'PM-AJAY GIA Grant',
                desc: 'Qualify for 100% government-funded toolkits up to ₹50,000 and nodal district training center admission.',
                icon: Award,
                color: 'text-teal-400',
                bg: 'bg-teal-500/10'
              },
              {
                step: '04',
                title: 'Sustainable Livelihood',
                desc: 'Launch an independent home or commercial enterprise with verified credentials and steady income.',
                icon: Briefcase,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/10'
              }
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 hover:border-emerald-500/40 transition-all hover:scale-[1.02] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`size-11 rounded-2xl ${st.bg} ${st.color} grid place-items-center font-bold`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">STEP {st.step}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-slate-100">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Livelihood Categories Gallery with Gemini Art */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                Key Livelihood Domains
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-100">
                Empowering SC Beneficiaries Across Core Trades
              </h2>
              <p className="text-slate-400 text-sm">
                Explore government-supported livelihood sectors eligible for 100% GIA machinery toolkits.
              </p>
            </div>

            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2.5 rounded-2xl border border-emerald-500/30 transition-all cursor-pointer"
              >
                <MapPin size={15} />
                <span>View All on Map</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* 4 Featured Gemini Category Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_ITEMS.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] flex flex-col group"
                >
                  {/* Category Image Header */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-amber-300">
                      NSQF L{cat.nsqfLevel}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-emerald-500/20 text-emerald-400 grid place-items-center">
                          <Icon size={14} />
                        </div>
                        <h3 className="font-bold text-base text-slate-100">{cat.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{cat.popularCourse}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[11px]">Monthly Income:</span>
                        <strong className="text-emerald-400 font-semibold">{cat.income}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-500 text-[11px]">PM-AJAY Grant:</span>
                        <span className="text-amber-300 font-medium text-[11px]">{cat.grantSupport}</span>
                      </div>
                    </div>

                    <button
                      onClick={onStartVoice}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <span>Match This Trade</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Illustrative Beneficiary Journeys Section */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              Illustrative Success Journeys
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              Real Impact for SC Community Members
            </h2>
            <p className="text-slate-400 text-xs">
              Example livelihood pathways demonstrated under PM-AJAY GIA guidelines.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Meenakshi Sundaram',
                loc: 'Theni, Tamil Nadu',
                trade: 'Self-Employed Tailoring',
                story: 'Spoke Tamil with SakshamAI, enrolled in NSQF Level 4 Garment Course, and received a ₹50,000 PM-AJAY motorized sewing machine grant. Now runs a boutique earning ₹22,000/mo.',
                grant: '₹50,000 GIA Toolset Grant',
                badge: 'Self-Employed'
              },
              {
                name: 'Ramesh Naidu',
                loc: 'Vizianagaram, Andhra Pradesh',
                trade: 'Certified Solar PV Installer',
                story: 'Spoke Telugu, completed 300 hours Suryamitra training with 100% stipend, and is now placed with district renewable power contractors earning ₹28,000/mo.',
                grant: '100% Free Training & Placement',
                badge: 'Industry Placed'
              },
              {
                name: 'Rahul Kumar',
                loc: 'Varanasi, Uttar Pradesh',
                trade: 'Digital Seva & Hardware Repair',
                story: 'Spoke Hindi with SakshamAI, certified in NIELIT Digital Literacy & Mobile Hardware Repair, received PM-AJAY digital toolkit. Runs a Digital Seva Kendra earning ₹25,000/mo.',
                grant: '₹50,000 GIA Equipment Grant',
                badge: 'CSC Entrepreneur'
              }
            ].map((j, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                      {j.badge}
                    </span>
                    <span className="text-[10px] text-slate-500">Example Journey</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-100">{j.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-emerald-400" />
                      <span>{j.loc}</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">Matched Livelihood:</span>
                    <strong className="text-xs text-amber-300">{j.trade}</strong>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{j.story}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">{j.grant}</span>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-emerald-950/40 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="size-16 rounded-3xl bg-emerald-500/20 text-emerald-400 grid place-items-center mx-auto shadow-xl shadow-emerald-500/20">
            <Mic size={32} />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-slate-100">
            Ready to Map Your PM-AJAY Livelihood?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Speak directly with SakshamAI in English, Tamil, Telugu, Hindi, Kannada, Malayalam, or Marathi to create your government beneficiary account today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartVoice}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 px-8 py-4 font-bold text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 cursor-pointer"
            >
              <Mic size={20} />
              <span>Start Voice Registration</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onOpenForm}
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-7 py-4 font-semibold text-sm transition-all"
            >
              <UserCheck size={18} />
              <span>Manual Form Mode</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
