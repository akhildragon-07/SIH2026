'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, MapPin, User, ShieldCheck, Check, Clock, Filter, Eye, Search } from 'lucide-react';
import { useToast } from './ui/ToastProvider';

interface ApplicantRecord {
  id: string;
  name: string;
  beneficiaryId: string;
  skills: string[];
  recommendedOpportunity: string;
  matchScore: number;
  eligibilityStatus: 'Verified SC' | 'Under Verification' | 'Document Required';
  district: string;
  state: string;
  appliedDate: string;
  grantRequestedINR: number;
  status: 'pending' | 'approved' | 'rejected' | 'info_requested';
}

const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app-1',
    name: 'Ravi Kumar',
    beneficiaryId: 'SC-AJAY-2026-1001',
    skills: ['Tailoring', 'Sewing Machine Operation', 'Garment Cutting'],
    recommendedOpportunity: 'PM-AJAY Tailoring & Boutique Micro-Enterprise',
    matchScore: 94,
    eligibilityStatus: 'Verified SC',
    district: 'Vizianagaram',
    state: 'Andhra Pradesh',
    appliedDate: '10 Sep 2026',
    grantRequestedINR: 50000,
    status: 'pending'
  },
  {
    id: 'app-2',
    name: 'Sunita Devi',
    beneficiaryId: 'SC-AJAY-2026-1002',
    skills: ['Handicrafts', 'Embroidery', 'Textile Work'],
    recommendedOpportunity: 'Self-Employed Tailor (AMH/Q1947)',
    matchScore: 91,
    eligibilityStatus: 'Verified SC',
    district: 'Sitapur',
    state: 'Uttar Pradesh',
    appliedDate: '09 Sep 2026',
    grantRequestedINR: 45000,
    status: 'pending'
  },
  {
    id: 'app-3',
    name: 'Yashwant Kumar',
    beneficiaryId: 'SC-AJAY-2026-1003',
    skills: ['House Wiring', 'Basic Electricals', 'Solar Panels'],
    recommendedOpportunity: 'Solar PV Installer (ELE/Q5901)',
    matchScore: 88,
    eligibilityStatus: 'Verified SC',
    district: 'Theni',
    state: 'Tamil Nadu',
    appliedDate: '08 Sep 2026',
    grantRequestedINR: 60000,
    status: 'pending'
  },
  {
    id: 'app-4',
    name: 'Manish Paswan',
    beneficiaryId: 'SC-AJAY-2026-1004',
    skills: ['Two-Wheeler Repair', 'Mechanical Assembly'],
    recommendedOpportunity: 'Auto Service Technician (ASC/Q1411)',
    matchScore: 85,
    eligibilityStatus: 'Under Verification',
    district: 'Gaya',
    state: 'Bihar',
    appliedDate: '07 Sep 2026',
    grantRequestedINR: 55000,
    status: 'pending'
  }
];

export default function AdminApprovalSection() {
  const { showToast } = useToast();
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApprovalSuccess, setActiveApprovalSuccess] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' } : app))
    );
    setActiveApprovalSuccess(id);
    showToast({
      type: 'grant',
      title: `Application Approved: ${name}`,
      description: 'PM-AJAY GIA toolkit grant sanctioned and notification sent to district portal.'
    });

    setTimeout(() => {
      setActiveApprovalSuccess(null);
    }, 3000);
  };

  const handleReject = (id: string, name: string) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'rejected' } : app))
    );
    showToast({
      type: 'warning',
      title: `Application Rejected: ${name}`,
      description: 'The applicant was notified with official feedback.'
    });
  };

  const handleRequestInfo = (id: string, name: string) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'info_requested' } : app))
    );
    showToast({
      type: 'info',
      title: `Information Requested: ${name}`,
      description: 'Notification sent requesting supplementary documentation.'
    });
  };

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.beneficiaryId.toLowerCase().includes(q) ||
        app.district.toLowerCase().includes(q) ||
        app.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={14} />
            <span>Interactive Nodal Officer Workflow</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold font-serif text-slate-100">
            Beneficiary GIA Grant Approval Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review AI-assessed SC beneficiary applications, evaluate NSQF skill match criteria, and sanction PM-AJAY GIA toolkit grants.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === f
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f} ({applicants.filter((a) => (f === 'all' ? true : a.status === f)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search applicants by name, Beneficiary ID, district, or skills..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-100 outline-none focus:border-amber-500"
        />
      </div>

      {/* Applicant Cards List */}
      <div className="grid gap-4">
        {filteredApplicants.map((app) => {
          const isJustApproved = activeApprovalSuccess === app.id;

          return (
            <div
              key={app.id}
              className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 space-y-4 ${
                isJustApproved
                  ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/40'
                  : app.status === 'approved'
                  ? 'border-emerald-500/40 bg-slate-950/60'
                  : app.status === 'rejected'
                  ? 'border-rose-500/30 bg-slate-950/40 opacity-70'
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
              }`}
            >
              {/* Card Top: Beneficiary Info + Status + Match % */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-slate-800 text-slate-200 font-bold grid place-items-center text-sm shadow-inner border border-slate-700">
                    {app.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-100">{app.name}</h3>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {app.beneficiaryId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-slate-500" />
                      <span>{app.district}, {app.state}</span>
                      <span className="mx-1"></span>
                      <span>Applied: {app.appliedDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <Sparkles size={12} />
                    <span>{app.matchScore}% Match</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      app.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : app.status === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : app.status === 'info_requested'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {app.status === 'approved'
                      ? '✓ Sanctioned'
                      : app.status === 'rejected'
                      ? '✗ Rejected'
                      : app.status === 'info_requested'
                      ? 'ℹ Info Requested'
                      : 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Middle: Opportunity & Grant Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Recommended Opportunity</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">{app.recommendedOpportunity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">GIA Grant Toolkit Amount</span>
                  <span className="font-bold text-emerald-300 mt-0.5 block">₹{app.grantRequestedINR.toLocaleString()} (100% Subsidy)</span>
                </div>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Extracted Skills:</span>
                {app.skills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 font-medium border border-slate-800"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-400">Social Category:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {app.eligibilityStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {app.status === 'pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRequestInfo(app.id, app.name)}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                      >
                        Request Info
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(app.id, app.name)}
                        className="px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-xs font-bold text-rose-300 transition-colors"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(app.id, app.name)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <Check size={14} className="stroke-[3]" />
                        <span>Approve Grant</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Action finalized for this applicant.
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
