'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface CircularProgressProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTierText?: boolean;
  animate?: boolean;
}

export default function CircularProgress({
  score,
  size = 'md',
  showLabel = true,
  showTierText = false,
  animate = true
}: CircularProgressProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }

    let start = 0;
    const duration = 1200; // ms
    const stepTime = 16; // ~60fps
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, animate]);

  // Determine Tier Color & Label
  let strokeColor = '#10b981'; // Emerald (90%+)
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  let tierLabel = 'Excellent Match';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (score < 60) {
    strokeColor = '#64748b'; // Slate
    glowColor = 'rgba(100, 116, 139, 0.3)';
    tierLabel = 'Explore Further';
    badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
  } else if (score < 75) {
    strokeColor = '#f59e0b'; // Amber
    glowColor = 'rgba(245, 158, 11, 0.35)';
    tierLabel = 'Good Match';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (score < 90) {
    strokeColor = '#06b6d4'; // Cyan/Teal
    glowColor = 'rgba(6, 182, 212, 0.35)';
    tierLabel = 'Strong Match';
    badgeBg = 'bg-teal-500/10 text-teal-300 border-teal-500/30';
  }

  const dimensionMap = {
    sm: { sizePx: 44, strokeWidth: 4, radius: 18, fontSize: 'text-xs', subSize: 'text-[8px]' },
    md: { sizePx: 64, strokeWidth: 5, radius: 26, fontSize: 'text-base', subSize: 'text-[9px]' },
    lg: { sizePx: 92, strokeWidth: 6, radius: 38, fontSize: 'text-2xl', subSize: 'text-[11px]' }
  };

  const config = dimensionMap[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 select-none">
      <div className="relative flex items-center justify-center">
        <svg
          width={config.sizePx}
          height={config.sizePx}
          viewBox={`0 0 ${config.sizePx} ${config.sizePx}`}
          className="transform -rotate-90"
        >
          {/* Background Track Circle */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke="#1e293b"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke={strokeColor}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out',
              filter: `drop-shadow(0 0 4px ${glowColor})`
            }}
          />
        </svg>

        {/* Centered Score Label */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-bold font-serif leading-none text-slate-100 ${config.fontSize}`}>
              {displayScore}%
            </span>
            {size !== 'sm' && (
              <span className={`font-mono uppercase tracking-wider font-extrabold text-slate-400 mt-0.5 ${config.subSize}`}>
                MATCH
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tier Label Badge */}
      {showTierText && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeBg}`}>
          {tierLabel}
        </span>
      )}
    </div>
  );
}
