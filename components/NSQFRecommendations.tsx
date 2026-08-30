'use client';

import React, { useState } from 'react';
import { NSQFCourse } from '@/lib/types';
import { GraduationCap, Clock, BookOpen, Sparkles, ShieldCheck, ExternalLink, Bookmark, CheckCircle2, Award, Filter } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NSQFProps {
  courses: NSQFCourse[];
  onSelectCourseDetails?: (course: NSQFCourse) => void;
}

export default function NSQFRecommendations({ courses, onSelectCourseDetails }: NSQFProps) {
  const { savedCourseIds, toggleSaveCourse } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-match' | 'level4' | 'level3'>('all');

  const filteredCourses = courses.filter((c) => {
    if (selectedFilter === 'high-match') return (c.matchScore || 0) >= 80;
    if (selectedFilter === 'level4') return c.nsqfLevel === 4;
    if (selectedFilter === 'level3') return c.nsqfLevel === 3;
    return true;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>National Qualifications Register (NQR) & NIELIT Mapped</span>
          </div>
          <h2 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            NSQF-Aligned Skilling Recommendations
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Certified qualification packs aligned with your background and skills. 100% sponsored under PM-AJAY GIA.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All (${courses.length})` },
            { id: 'high-match', label: 'Top Skill Matches' },
            { id: 'level4', label: 'NSQF Level 4' },
            { id: 'level3', label: 'NSQF Level 3' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === f.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, idx) => {
          const isPrimary = idx === 0 && selectedFilter === 'all';
          const isSaved = savedCourseIds.includes(course.id);
          const isVerified = course.verificationStatus === 'VERIFIED_OFFICIAL' || course.isVerifiedGovernmentData;
          const officialUrl = course.officialCourseUrl || 'https://nqr.gov.in/';

          return (
            <div
              key={course.id}
              className={`rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between ${
                isPrimary
                  ? 'border-emerald-500 bg-slate-900 shadow-2xl ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 border border-emerald-500/30">
                    <GraduationCap size={14} /> NSQF Level {course.nsqfLevel}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      Match: {course.matchScore}%
                    </span>

                    <button
                      onClick={() => toggleSaveCourse(course.id)}
                      className={`grid size-8 place-items-center rounded-full transition-colors ${
                        isSaved ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Course'}
                    >
                      <Bookmark size={14} />
                    </button>
                  </div>
                </div>

                {/* QP Code & Title */}
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    QP: {course.qpCode}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isVerified ? 'VERIFIED NQR' : 'DEMO'}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-100 mt-2 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-400 mt-1">{course.sector}</p>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Course Metadata */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-400" />
                    <span>Duration: <strong className="text-slate-100">{course.durationText}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-amber-400" />
                    <span>Eligibility: <strong className="text-slate-100">{course.eligibility}</strong></span>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="mt-4 space-y-2">
                  {course.matchingSkills && course.matchingSkills.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                        <CheckCircle2 size={11} /> Skills You Already Have ({course.matchingSkills.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {course.matchingSkills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Key Competencies Taught:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {course.skillsTaught.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="rounded-lg bg-slate-950 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2.5">
                {course.rationale && (
                  <div className="rounded-xl bg-emerald-950/40 p-2.5 border border-emerald-800/40 text-[11px] text-emerald-300 leading-relaxed">
                    <strong className="block text-emerald-400 font-bold">Why Recommended:</strong>
                    {course.rationale}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {onSelectCourseDetails && (
                    <button
                      onClick={() => onSelectCourseDetails(course)}
                      className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 text-xs font-bold transition-all text-center"
                    >
                      View Details
                    </button>
                  )}

                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-3 text-xs font-bold transition-all shadow-md text-center"
                  >
                    <span>Visit Official NQR</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

