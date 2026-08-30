'use client';

import React, { useState, useEffect } from 'react';
import { AdminAnalyticsData } from '@/lib/types';
import { BarChart3, Users, Landmark, GraduationCap, TrendingUp, AlertTriangle, MapPin, Search, Download, Filter, ShieldCheck, Sparkles, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedEducation, setSelectedEducation] = useState('All');

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
      {/* Header */}
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
            Real-time insights into SC community skilling gaps, district demands, and GIA grant allocation.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting PM-AJAY GIA District Monitoring Report (PDF/Excel)...')}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all shadow-md"
        >
          <Download size={15} />
          <span>Export Official Report</span>
        </button>
      </div>

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
            {data.totalBeneficiaries.toLocaleString()}
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
            ₹{(data.totalGiaGrantAllocatedINR / 10000000).toFixed(2)} Cr
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
            {data.nsqfCoursesRecommended.toLocaleString()}
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
            {data.skillGapsIdentified.toLocaleString()}
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
  );
}
