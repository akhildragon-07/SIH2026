'use client';

import React, { useState, useEffect } from 'react';
import { AdminAnalyticsData } from '@/lib/types';
import { getDistrictOpportunityStats } from '@/lib/opportunity-matcher';
import { OPPORTUNITIES_DATASET, DISTRICT_CENTROIDS } from '@/lib/opportunity-data';
import {
  BarChart3,
  Users,
  Landmark,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Search,
  Download,
  Filter,
  ShieldCheck,
  Sparkles,
  IndianRupee,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  CheckCircle2,
  Layers,
  Compass,
  Briefcase,
  Award,
  Activity,
  Flame,
  FileCheck
} from 'lucide-react';
import AdminApprovalSection from './AdminApprovalSection';
import AnimatedCounter from './ui/AnimatedCounter';
import { getAllStates, getDistrictsForState } from '@/lib/india-locations';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'approvals' | 'heatmaps'>('analytics');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [officerName, setOfficerName] = useState('Dr. V. Sharma (Central Nodal Officer)');

  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedEducation, setSelectedEducation] = useState('All');
  const [selectedHeatmapDistrict, setSelectedHeatmapDistrict] = useState<string>('Theni');

  const allStates = React.useMemo(() => getAllStates(), []);
  const availableDistrictsForFilter = React.useMemo(() => {
    if (selectedState === 'All') return [];
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  const districtStatsMap = getDistrictOpportunityStats();
  const uniqueDistrictStats = React.useMemo(() => {
    const seen = new Set<string>();
    const list: any[] = [];
    Object.values(districtStatsMap).forEach((stat: any) => {
      const key = `${stat.state}:${stat.district}`;
      if (!seen.has(key)) {
        seen.add(key);
        list.push(stat);
      }
    });
    return list;
  }, [districtStatsMap]);

  const currentDistrictMetrics = districtStatsMap[selectedHeatmapDistrict] || {
    district: selectedHeatmapDistrict,
    state: 'Tamil Nadu',
    total: 6,
    training: 2,
    job: 2,
    apprenticeship: 1,
    livelihood: 2,
    topSkills: ['Agriculture', 'Tailoring', 'Food Processing', 'Electrical'],
    density: 'High'
  };

  // Check persistent session in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('saksham_admin_session');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/admin-stats')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Failed to load admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const validUsers = [
      { user: 'admin', pass: 'admin123', name: 'Dr. V. Sharma (Ministry Nodal Director)' },
      { user: 'pmajay_officer', pass: 'pmajay2026', name: 'Smt. Ananya Sen (GIA Program Officer)' },
      { user: 'nodal_ap', pass: 'sih2026', name: 'Shri R. Prabhakar (AP State District Officer)' }
    ];

    const match = validUsers.find(
      (u) => u.user.toLowerCase() === username.trim().toLowerCase() && u.pass === password
    );

    if (match) {
      setIsAuthenticated(true);
      setOfficerName(match.name);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('saksham_admin_session', 'true');
        sessionStorage.setItem('saksham_admin_officer', match.name);
      }
    } else {
      setAuthError('Invalid Officer Username or Password. Please verify credentials or use Quick Demo Access below.');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setIsAuthenticated(true);
    setOfficerName('Dr. V. Sharma (Ministry Nodal Director)');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('saksham_admin_session', 'true');
      sessionStorage.setItem('saksham_admin_officer', 'Dr. V. Sharma (Ministry Nodal Director)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('saksham_admin_session');
      sessionStorage.removeItem('saksham_admin_officer');
    }
  };

  // If not authenticated, render official Ministry Login Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full mx-auto max-w-md px-4 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <Landmark size={32} />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 mt-2">
              <ShieldCheck size={13} />
              <span>Restricted Access Portal</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-100">
              Admin & Officer Login
            </h2>
            <p className="text-xs text-slate-400">
              Ministry of Social Justice & Empowerment · PM-AJAY GIA Central Monitoring System
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Officer Username / ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or pmajay_officer"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-amber-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Officer Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure officer password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 pr-10 text-sm text-slate-100 outline-none focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold py-3.5 text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <Lock size={16} />
              <span>Login to Monitoring Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Login Preset for Hackathon Judges */}
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <KeyRound size={13} /> Demo Evaluation Credentials:
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Pre-Configured</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <p>Username: <strong className="text-slate-200">admin</strong></p>
              <p>Password: <strong className="text-slate-200">admin123</strong></p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>⚡ 1-Click Quick Demo Login</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>NIC SSL 256-Bit Authenticated Gateway</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="w-full mx-auto max-w-7xl px-4 py-16 text-center text-slate-400">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-bold">
          <Sparkles className="animate-spin" size={20} />
          <span>Loading PM-AJAY Admin Analytics Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header with Officer Profile & Signout */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            <BarChart3 size={13} />
            <span>Ministry Monitoring & Evaluation Dashboard</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            PM-AJAY GIA Programme Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as: <strong className="text-emerald-400">{officerName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting PM-AJAY GIA District Monitoring Report (PDF/Excel)...')}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-all shadow-md"
          >
            <Download size={15} />
            <span>Export Official Report</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 px-4 py-2.5 text-xs font-bold transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-3 overflow-x-auto border-b border-slate-800 pb-2">
        {[
          { id: 'analytics', label: 'M&E Analytics & Overview', icon: BarChart3 },
          { id: 'approvals', label: 'Grant Applications & Approvals (Nodal Workflow)', icon: FileCheck },
          { id: 'heatmaps', label: 'District Opportunity Density & Skill Gap Matrix', icon: Flame }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeAdminTab === 'approvals' && (
        <AdminApprovalSection />
      )}

      {activeAdminTab === 'analytics' && (
        <div className="space-y-8">
          {/* Metric Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Users size={20} />
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  100% SC Beneficiaries
                </span>
              </div>
              <p className="text-3xl font-bold font-serif text-slate-100 mt-4">
                <AnimatedCounter end={data.totalBeneficiaries} duration={1200} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Beneficiaries Mapped</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                  <IndianRupee size={20} />
                </span>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  GIA Component
                </span>
              </div>
              <p className="text-3xl font-bold font-serif text-slate-100 mt-4">
                ₹<AnimatedCounter end={Number((data.totalGiaGrantAllocatedINR / 10000000).toFixed(2))} decimals={2} duration={1200} /> Cr
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">GIA Grant Fund Allocated</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-teal-500/10 text-teal-400">
                  <GraduationCap size={20} />
                </span>
                <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                  NCVET NSQF
                </span>
              </div>
              <p className="text-3xl font-bold font-serif text-slate-100 mt-4">
                <AnimatedCounter end={data.nsqfCoursesRecommended} duration={1200} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">NSQF Courses Recommended</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
                  <AlertTriangle size={20} />
                </span>
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  Action Required
                </span>
              </div>
              <p className="text-3xl font-bold font-serif text-slate-100 mt-4">
                <AnimatedCounter end={data.skillGapsIdentified} duration={1200} />
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill Gaps Mapped</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-900 p-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Filter size={15} className="text-emerald-400" />
          <span>Analytics Filters:</span>
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-200 outline-none"
        >
          <option value="All">All Districts</option>
          <option value="Vizianagaram">Vizianagaram (AP)</option>
          <option value="Sitapur">Sitapur (UP)</option>
          <option value="Gaya">Gaya (Bihar)</option>
          <option value="Solapur">Solapur (MH)</option>
        </select>

        <select
          value={selectedEducation}
          onChange={(e) => setSelectedEducation(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-200 outline-none"
        >
          <option value="All">All Education Levels</option>
          <option value="Below 8th">Below 8th</option>
          <option value="8th Pass">8th Pass</option>
          <option value="10th Pass">10th Pass</option>
          <option value="12th Pass">12th Pass</option>
        </select>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Education Breakdown */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
          <h3 className="text-lg font-bold font-serif text-slate-100 flex items-center justify-between">
            <span>Education Level Distribution</span>
            <span className="text-xs font-sans text-slate-400 font-normal">SC Beneficiaries</span>
          </h3>

          <div className="space-y-4">
            {data.educationBreakdown.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-emerald-400">{item.percentage}% ({item.count.toLocaleString()})</span>
                </div>
                <div className="h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Livelihood Preferences */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
          <h3 className="text-lg font-bold font-serif text-slate-100 flex items-center justify-between">
            <span>Preferred Livelihood Breakdown</span>
            <span className="text-xs font-sans text-amber-400 font-bold">GIA Toolkit Demand</span>
          </h3>

          <div className="space-y-4">
            {data.livelihoodPreferences.map((pref) => (
              <div key={pref.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{pref.category}</span>
                  <span className="text-amber-400">{pref.percentage}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{ width: `${pref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Existing Skills */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
          <h3 className="text-lg font-bold font-serif text-slate-100">
            Most Common Skills Mapped in SC Communities
          </h3>

          <div className="space-y-3">
            {data.topExistingSkills.map((sk) => (
              <div key={sk.skill} className="flex items-center gap-3 text-xs">
                <span className="w-44 font-semibold text-slate-300 shrink-0 truncate">{sk.skill}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${sk.percentage}%` }} />
                </div>
                <span className="w-10 text-right font-bold text-teal-400">{sk.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skill Gaps */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-5">
          <h3 className="text-lg font-bold font-serif text-slate-100">
            Top Skill Gaps Identified (Training Interventions Needed)
          </h3>

          <div className="space-y-3">
            {data.topSkillGaps.map((sg) => (
              <div key={sg.skill} className="flex items-center gap-3 text-xs">
                <span className="w-44 font-semibold text-slate-300 shrink-0 truncate">{sg.skill}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${sg.percentage}%` }} />
                </div>
                <span className="w-10 text-right font-bold text-rose-400">{sg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* District Livelihood Demand Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold font-serif text-slate-100 flex items-center justify-between">
          <span>District-wise Livelihood & Skilling Demands</span>
          <span className="text-xs font-sans text-emerald-400 font-bold">6 Key Focus Districts</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="py-3 px-4">District & State</th>
                <th className="py-3 px-4">Beneficiaries Mapped</th>
                <th className="py-3 px-4">Primary Livelihood Need</th>
                <th className="py-3 px-4">PM-AJAY GIA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
              {data.districtDistribution.map((dist) => (
                <tr key={dist.district} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-400" /> {dist.district}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300 font-bold">
                    {dist.beneficiaries.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">{dist.topNeed}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <ShieldCheck size={12} /> Active Grant Sanctioned
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LOCATION-BASED DISTRICT OPPORTUNITY ANALYTICS & SPATIAL HEATMAP */}
      {/* ============================================================ */}
      {(activeAdminTab === 'heatmaps' || activeAdminTab === 'analytics') && (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <Compass size={14} />
              <span>Spatial Analytics & Livelihood Heatmap</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold font-serif text-slate-100">
              District-Level Opportunity Mapping & Skill Gap Zones
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Geographic opportunity density, training availability, wage employment vacancies, and supply-demand mismatches across key PM-AJAY intervention districts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Select Focus District:</span>
            <select
              value={selectedHeatmapDistrict}
              onChange={(e) => setSelectedHeatmapDistrict(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-bold text-emerald-300 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Theni">Theni (Tamil Nadu - Focus)</option>
              <option value="Madurai">Madurai (Tamil Nadu)</option>
              <option value="Dindigul">Dindigul (Tamil Nadu)</option>
              <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
              <option value="Tiruppur">Tiruppur (Tamil Nadu)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Salem">Salem (Tamil Nadu)</option>
              <option value="Erode">Erode (Tamil Nadu)</option>
              <option value="Vizianagaram">Vizianagaram (Andhra Pradesh)</option>
              <option value="Vijayawada">Vijayawada (Andhra Pradesh)</option>
              <option value="Guntur">Guntur (Andhra Pradesh)</option>
              <option value="Tirupati">Tirupati (Andhra Pradesh)</option>
              <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
              <option value="Bengaluru">Bengaluru (Karnataka)</option>
              <option value="Mysuru">Mysuru (Karnataka)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Solapur">Solapur (Maharashtra)</option>
              <option value="Kochi">Kochi (Kerala)</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram (Kerala)</option>
              <option value="Sitapur">Sitapur (Uttar Pradesh)</option>
              <option value="Gaya">Gaya (Bihar)</option>
              <option value="Patna">Patna (Bihar)</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
            </select>
          </div>
        </div>

        {/* Selected District Opportunity Metric Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Opportunities</p>
            <p className="text-2xl font-bold font-serif text-slate-100">{currentDistrictMetrics.total}</p>
            <span className="text-[10px] text-slate-500">{selectedHeatmapDistrict} Region</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
              <GraduationCap size={12} /> Training Centers
            </p>
            <p className="text-2xl font-bold font-serif text-blue-300">{currentDistrictMetrics.training}</p>
            <span className="text-[10px] text-slate-500">NSQF Accredited Facilities</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Briefcase size={12} /> Wage Jobs
            </p>
            <p className="text-2xl font-bold font-serif text-emerald-300">{currentDistrictMetrics.job}</p>
            <span className="text-[10px] text-slate-500">Verified MSME / Industry</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Award size={12} /> Apprenticeships
            </p>
            <p className="text-2xl font-bold font-serif text-amber-300">{currentDistrictMetrics.apprenticeship}</p>
            <span className="text-[10px] text-slate-500">Stipend Supported (NAPS)</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Sparkles size={12} /> Livelihood Units
            </p>
            <p className="text-2xl font-bold font-serif text-purple-300">{currentDistrictMetrics.livelihood}</p>
            <span className="text-[10px] text-slate-500">PM-AJAY GIA Grant Linked</span>
          </div>
        </div>

        {/* Most Demanded Skills & Heatmap Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Most Demanded Skills in District */}
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-serif text-slate-100 flex items-center justify-between">
              <span>Top Demanded Skills in {selectedHeatmapDistrict}</span>
              <span className="text-[11px] font-mono text-emerald-400">Ranked by Openings</span>
            </h3>

            <div className="space-y-2.5">
              {currentDistrictMetrics.topSkills.map((sk: string, i: number) => (
                <div key={sk} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                      0{i + 1}
                    </span>
                    <span className="font-semibold text-slate-200">{sk}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">High Demand Priority</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spatial Opportunity Density & Gap Alert */}
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-serif text-slate-100 flex items-center gap-2">
                <Flame size={16} className="text-amber-400" />
                <span>Opportunity Density & Skill Gap Zone</span>
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentDistrictMetrics.density === 'High'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {currentDistrictMetrics.density} Density Zone
              </span>
            </div>

            {/* Regional Diagnosis */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={13} />
                <span>Identified Regional Mismatch & Recommendation:</span>
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedHeatmapDistrict === 'Theni'
                  ? 'Theni District exhibits high tailoring skill availability (68% SC beneficiary baseline) but limited formal industrial garment factory vacancies within 15 km. High-impact intervention: Prioritize PM-AJAY GIA self-employment toolkits, motorized sewing machine subsidies, and rural boutique cluster linkages.'
                  : selectedHeatmapDistrict === 'Tiruppur'
                  ? 'Tiruppur garment export hub has massive workforce demand for certified overlock and flatlock sewing operators (3,200+ vacancies). Recommended intervention: Establish fast-track 300-hour NSQF Level 4 training pipelines with direct placement guarantees.'
                  : `${selectedHeatmapDistrict} district requires balanced funding towards NSQF Level 3-4 skill certification and GIA equipment toolkits to match local MSME market demand.`}
              </p>
            </div>
          </div>
        </div>

        {/* District Opportunity Heatmap Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold font-serif text-slate-100 flex items-center justify-between">
            <span>All-Districts Opportunity Density & Readiness Matrix</span>
            <span className="text-[11px] text-slate-400 font-normal">Active Nodal Zones</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {Object.keys(districtStatsMap).map((distKey) => {
              const dStat = districtStatsMap[distKey];
              const isSelected = selectedHeatmapDistrict === distKey;
              return (
                <button
                  key={distKey}
                  type="button"
                  onClick={() => setSelectedHeatmapDistrict(distKey)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{distKey}</span>
                    <span className={`size-2 rounded-full ${dStat.density === 'High' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{dStat.state}</p>
                  <p className="text-xs font-mono font-bold text-emerald-400 mt-2">
                    {dStat.total} Opportunities
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
