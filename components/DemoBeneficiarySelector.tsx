'use client';

import React from 'react';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';
import { BeneficiaryProfile } from '@/lib/types';
import { Sparkles, UserCheck } from 'lucide-react';

interface DemoSelectorProps {
  onSelectProfile: (profile: BeneficiaryProfile) => void;
  activeDemoId?: string;
}

export default function DemoBeneficiarySelector({ onSelectProfile, activeDemoId }: DemoSelectorProps) {
  return (
    <div className="w-full bg-amber-500/10 border-y border-amber-500/20 py-3 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={16} className="text-amber-600 animate-pulse" />
          <span>Hackathon Demo Mode: Load Preset SC Beneficiary</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DEMO_BENEFICIARIES.map((demo) => {
            const isActive = activeDemoId === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => onSelectProfile(demo.profile)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-100 text-slate-800 border border-amber-200'
                }`}
                title={demo.tag}
              >
                <UserCheck size={13} />
                <span>{demo.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
