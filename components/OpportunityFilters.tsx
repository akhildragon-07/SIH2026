'use client';

import React from 'react';
import { OpportunityFilterState } from '@/lib/types';
import { AVAILABLE_SKILLS_FILTER } from '@/lib/opportunity-data';
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
  Layers
} from 'lucide-react';

interface OpportunityFiltersProps {
  filters: OpportunityFilterState;
  onChangeFilters: (newFilters: OpportunityFilterState) => void;
  totalResultsCount: number;
}

export default function OpportunityFilters({
  filters,
  onChangeFilters,
  totalResultsCount
}: OpportunityFiltersProps) {
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

  const handleReset = () => {
    onChangeFilters({
      type: 'all',
      radiusKm: 25,
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
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
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
            placeholder="Search by name, skill, course, provider, city..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-500" />
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
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all truncate ${
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

      {/* Search Radius */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Compass size={13} className="text-amber-400" />
            <span>Search Radius</span>
          </span>
          <span className="text-amber-400 font-bold">{filters.radiusKm} km</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[5, 10, 25, 50].map((radius) => {
            const isSelected = filters.radiusKm === radius;
            return (
              <button
                key={radius}
                type="button"
                onClick={() => handleRadiusChange(radius)}
                className={`py-2 rounded-xl text-xs font-bold transition-all text-center ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                &lt;{radius} km
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
          <option value="all">All Skills</option>
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
                className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-colors ${
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
