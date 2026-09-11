'use client';

import React, { useMemo } from 'react';
import { OpportunityFilterState } from '@/lib/types';
import {
  AVAILABLE_SKILLS_FILTER,
  AVAILABLE_SECTORS,
  AVAILABLE_JOB_ROLES,
  AVAILABLE_NSQF_LEVELS
} from '@/lib/opportunity-data';
import { getAllStates, getDistrictsForState } from '@/lib/india-locations';
import {
  Search,
  Filter,
  RotateCcw,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  MapPin,
  Compass,
  Layers,
  IndianRupee,
  Building2,
  CheckSquare,
  Square
} from 'lucide-react';

interface OpportunityFiltersProps {
  filters: OpportunityFilterState;
  onChangeFilters: (newFilters: OpportunityFilterState) => void;
  totalResultsCount: number;
  userDistrict?: string;
  userState?: string;
}

export default function OpportunityFilters({
  filters,
  onChangeFilters,
  totalResultsCount,
  userDistrict,
  userState
}: OpportunityFiltersProps) {
  const allStates = useMemo(() => getAllStates(), []);

  const availableDistricts = useMemo(() => {
    if (!filters.state || filters.state === 'all') {
      return [];
    }
    return getDistrictsForState(filters.state);
  }, [filters.state]);

  const handleStateChange = (state: string) => {
    onChangeFilters({
      ...filters,
      state,
      district: 'all' // Reset district when state changes
    });
  };

  const handleDistrictChange = (district: string) => {
    onChangeFilters({
      ...filters,
      district
    });
  };

  const handleOnlyMyDistrictToggle = () => {
    onChangeFilters({
      ...filters,
      onlyMyDistrict: !filters.onlyMyDistrict
    });
  };

  const handleSectorChange = (sector: string) => {
    onChangeFilters({ ...filters, sector });
  };

  const handleJobRoleChange = (jobRole: string) => {
    onChangeFilters({ ...filters, jobRole });
  };

  const handleNsqfChange = (nsqfLevel: string) => {
    onChangeFilters({
      ...filters,
      nsqfLevel: nsqfLevel === 'all' ? 'all' : parseInt(nsqfLevel, 10)
    });
  };

  const handleTypeChange = (type: OpportunityFilterState['type']) => {
    onChangeFilters({ ...filters, type });
  };

  const handleRadiusChange = (radiusKm: number) => {
    onChangeFilters({ ...filters, radiusKm });
  };

  const handleSkillChange = (skill: string) => {
    onChangeFilters({ ...filters, skill });
  };

  const handleGoalChange = (careerGoal: OpportunityFilterState['careerGoal']) => {
    onChangeFilters({ ...filters, careerGoal });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : 0;
    onChangeFilters({ ...filters, minSalary: val });
  };

  const handleReset = () => {
    onChangeFilters({
      type: 'all',
      radiusKm: 25,
      state: 'all',
      district: 'all',
      sector: 'all',
      jobRole: 'all',
      nsqfLevel: 'all',
      minSalary: 0,
      maxSalary: 0,
      onlyMyDistrict: false,
      skill: 'all',
      careerGoal: 'all',
      searchQuery: ''
    });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold font-serif text-slate-100 uppercase tracking-wider">
            Filter Opportunities
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Search Opportunities
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by role, skill, provider, district..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* LOCATION FILTERS: STATE & DISTRICT */}
      {/* ============================================================ */}
      <div className="space-y-3 rounded-2xl bg-slate-950/70 p-3.5 border border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <MapPin size={13} />
            <span>State & District Filter</span>
          </label>
          {userDistrict && (
            <span className="text-[10px] text-slate-400">
              Home: <strong className="text-emerald-300">{userDistrict}</strong>
            </span>
          )}
        </div>

        {/* State Dropdown */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold text-slate-400">Select State</label>
          <select
            value={filters.state || 'all'}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All States across India</option>
            {allStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Dependent District Dropdown */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold text-slate-400">Select District</label>
          <select
            value={filters.district || 'all'}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!filters.state || filters.state === 'all'}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">
              {filters.state && filters.state !== 'all'
                ? `All Districts in ${filters.state}`
                : 'Select a State first to view Districts'}
            </option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* "In My District" Fast Toggle */}
        <button
          type="button"
          onClick={handleOnlyMyDistrictToggle}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            filters.onlyMyDistrict
              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {filters.onlyMyDistrict ? (
              <CheckSquare size={15} className="text-emerald-400 shrink-0" />
            ) : (
              <Square size={15} className="text-slate-500 shrink-0" />
            )}
            <span>Show Only In My Home District</span>
          </div>
          {userDistrict && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {userDistrict}
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* SECTOR & JOB ROLE FILTERS */}
      {/* ============================================================ */}
      <div className="space-y-3">
        {/* Sector Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 size={13} className="text-blue-400" />
            <span>Sector / Industry</span>
          </label>
          <select
            value={filters.sector || 'all'}
            onChange={(e) => handleSectorChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Sectors ({AVAILABLE_SECTORS.length} Domains)</option>
            {AVAILABLE_SECTORS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* Job Role Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase size={13} className="text-purple-400" />
            <span>Job Role</span>
          </label>
          <select
            value={filters.jobRole || 'all'}
            onChange={(e) => handleJobRoleChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Job Roles</option>
            {AVAILABLE_JOB_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opportunity Type */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Opportunity Type</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'training', label: 'Training Center' },
            { id: 'job', label: 'Wage Job' },
            { id: 'apprenticeship', label: 'Apprenticeship' },
            { id: 'self-employment', label: 'Self Employment' },
            { id: 'enterprise', label: 'Enterprise / Hub' }
          ].map((item) => {
            const isSelected = filters.type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTypeChange(item.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all truncate cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* NSQF Level & Salary Range Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* NSQF Level Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <GraduationCap size={13} className="text-teal-400" />
            <span>NSQF Level</span>
          </label>
          <select
            value={filters.nsqfLevel?.toString() || 'all'}
            onChange={(e) => handleNsqfChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Levels</option>
            {AVAILABLE_NSQF_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Min Salary Filter */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <IndianRupee size={13} className="text-emerald-400" />
            <span>Min Salary</span>
          </label>
          <input
            type="number"
            step="1000"
            min="0"
            placeholder="e.g. 12000"
            value={filters.minSalary || ''}
            onChange={handleMinSalaryChange}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Search Radius */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Compass size={13} className="text-amber-400" />
            <span>Search Radius</span>
          </span>
          <span className="text-amber-400 font-bold">{filters.radiusKm === 0 ? 'All India' : `${filters.radiusKm} km`}</span>
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[5, 10, 25, 50, 100].map((radius) => {
            const isSelected = filters.radiusKm === radius;
            return (
              <button
                key={radius}
                type="button"
                onClick={() => handleRadiusChange(radius)}
                className={`py-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                &lt;{radius}km
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Filter by Skill Domain
        </label>
        <select
          value={filters.skill}
          onChange={(e) => handleSkillChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">All Skills ({AVAILABLE_SKILLS_FILTER.length} Skills)</option>
          {AVAILABLE_SKILLS_FILTER.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>

      {/* Career Goal Filter */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Career Goal Alignment
        </label>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Career Goals' },
            { id: 'job', label: 'Wage Employment' },
            { id: 'self-employment', label: 'Self Employment' },
            { id: 'entrepreneurship', label: 'Entrepreneurship' }
          ].map((g) => {
            const isSelected = filters.careerGoal === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGoalChange(g.id as any)}
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                <span>{g.label}</span>
                {isSelected && <span className="size-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="rounded-2xl bg-slate-950 p-3.5 border border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Showing <strong className="text-emerald-400 font-bold">{totalResultsCount}</strong> matched opportunities
        </p>
      </div>
    </div>
  );
}
