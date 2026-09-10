'use client';

import React, { useState } from 'react';
import { NSQFCourse } from '@/lib/types';
import { GraduationCap, Clock, BookOpen, Sparkles, ShieldCheck, ExternalLink, Bookmark, CheckCircle2, Award, Filter, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/ToastProvider';
import NSQFPathwayModal, { NSQFPathwayNodeData } from './NSQFPathwayModal';
import Image from 'next/image';
import CircularProgress from './ui/CircularProgress';

function getSectorImage(sector?: string, title?: string): string {
  const text = `${sector || ''} ${title || ''}`.toLowerCase();
  if (text.includes('tailor') || text.includes('apparel') || text.includes('garment') || text.includes('textile') || text.includes('sewing') || text.includes('fashion')) {
    return '/images/cat_tailoring_garment.jpg';
  }
  if (text.includes('solar') || text.includes('electric') || text.includes('wireman') || text.includes('energy') || text.includes('power')) {
    return '/images/cat_solar_electrical.jpg';
  }
  if (text.includes('agri') || text.includes('farm') || text.includes('crop') || text.includes('food') || text.includes('horticulture') || text.includes('organic') || text.includes('dairy') || text.includes('poultry')) {
    return '/images/cat_agriculture_farming.jpg';
  }
  if (text.includes('digit') || text.includes('it') || text.includes('comput') || text.includes('hardware') || text.includes('repair') || text.includes('electronics') || text.includes('mobile') || text.includes('telecom')) {
    return '/images/cat_digital_electronics.jpg';
  }
  return '/images/hero_saksham_guide.jpg';
}

interface NSQFProps {
  courses: NSQFCourse[];
  onSelectCourseDetails?: (course: NSQFCourse) => void;
}

export default function NSQFRecommendations({ courses, onSelectCourseDetails }: NSQFProps) {
  const { savedCourseIds, toggleSaveCourse } = useAuth();
  const { showToast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high-match' | 'level4' | 'level3'>('all');
  const [activeModalData, setActiveModalData] = useState<NSQFPathwayNodeData | null>(null);

  const filteredCourses = courses.filter((c) => {
    if (selectedFilter === 'high-match') return (c.matchScore || 0) >= 80;
    if (selectedFilter === 'level4') return c.nsqfLevel === 4;
    if (selectedFilter === 'level3') return c.nsqfLevel === 3;
    return true;
  });

  const handleToggleSave = (course: NSQFCourse) => {
    const isSaved = savedCourseIds.includes(course.id);
    toggleSaveCourse(course.id);
    showToast({
      type: isSaved ? 'info' : 'success',
      title: isSaved ? 'Removed Bookmark' : 'Course Bookmarked',
      description: `${course.title} (${course.qpCode})`
    });
  };

  const handleOpenDetails = (course: NSQFCourse) => {
    if (onSelectCourseDetails) {
      onSelectCourseDetails(course);
    }
    setActiveModalData({
      levelTitle: `NSQF Level ${course.nsqfLevel} Certification`,
      nsqfLevel: course.nsqfLevel,
      courseName: course.title,
      duration: course.durationText,
      skillsGained: course.skillsTaught,
      eligibility: course.eligibility,
      provider: 'NIELIT / NSDC Accredited Training Center',
      certification: 'National Council for Vocational Education and Training (NCVET)',
      giaToolkitAssistance: '100% equipment grant & toolkit subsidy provided upon course completion under PM-AJAY GIA Component.',
      officialNqrUrl: course.officialCourseUrl || 'https://nqr.gov.in/'
    });
  };

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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
          const sectorImg = getSectorImage(course.sector, course.title);

          return (
            <div
              key={course.id}
              className={`group rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isPrimary
                  ? 'border-emerald-500 bg-slate-900 shadow-2xl ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:bg-slate-900'
              }`}
            >
              {/* Card Image Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                <Image
                  src={sectorImg}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 text-xs font-extrabold px-3 py-1 border border-emerald-500/30 shadow-md">
                    <GraduationCap size={13} /> NSQF Level {course.nsqfLevel}
                  </span>

                  <button
                    onClick={() => handleToggleSave(course)}
                    className={`grid size-8 place-items-center rounded-full backdrop-blur-md transition-colors cursor-pointer shadow-md ${
                      isSaved ? 'bg-amber-500 text-slate-950' : 'bg-slate-950/80 text-slate-300 hover:text-white border border-white/20'
                    }`}
                    title={isSaved ? 'Remove Bookmark' : 'Save Course'}
                  >
                    <Bookmark size={14} />
                  </button>
                </div>

                {/* Bottom of banner: QP and Verification */}
                <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                    QP: {course.qpCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md ${
                    isVerified ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    {isVerified ? 'VERIFIED NQR' : 'DEMO'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-emerald-400">{course.sector}</p>
                      <h3 className="text-lg font-bold font-serif text-slate-100 mt-1 leading-snug">
                        {course.title}
                      </h3>
                    </div>
                    {/* Animated Circular Match Dial */}
                    <div className="shrink-0 -mt-1">
                      <CircularProgress score={course.matchScore || 85} size="sm" showLabel={true} />
                    </div>
                  </div>

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
                    <button
                      onClick={() => handleOpenDetails(course)}
                      className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} />
                      <span>View Details</span>
                    </button>

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
            </div>
          );
        })}
      </div>

      {/* NSQF Pathway Details Modal */}
      {activeModalData && (
        <NSQFPathwayModal
          nodeData={activeModalData}
          onClose={() => setActiveModalData(null)}
          onSelectAction={() => {
            showToast({
              type: 'grant',
              title: 'Enrolled in Module',
              description: `${activeModalData.courseName} seat reserved at local center.`
            });
            setActiveModalData(null);
          }}
        />
      )}
    </div>
  );
}

