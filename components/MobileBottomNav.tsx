'use client';

import React from 'react';
import { Landmark, Mic, GraduationCap, MapPin, CreditCard, BarChart3, UserCheck } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

export default function MobileBottomNav({ currentView, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Landmark },
    { id: 'voice', label: 'Voice AI', icon: Mic, highlight: true },
    { id: 'results', label: 'Plan', icon: GraduationCap },
    { id: 'opportunities', label: 'Map', icon: MapPin },
    { id: 'card', label: 'ID Card', icon: CreditCard },
    { id: 'admin', label: 'Admin', icon: BarChart3 }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-2 py-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'voice' && ['voice', 'onboard-choice', 'text', 'manual'].includes(currentView));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                item.highlight && !isActive
                  ? 'text-emerald-400'
                  : isActive
                  ? 'text-emerald-400 font-bold bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`grid place-items-center ${item.highlight ? 'size-8 rounded-full bg-emerald-500 text-slate-950 -mt-2 shadow-lg shadow-emerald-500/30' : 'size-6'}`}>
                <Icon size={item.highlight ? 18 : 16} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
