'use client';

import React, { useState } from 'react';
import { BeneficiaryProfile, EducationLevel, LivelihoodType } from '@/lib/types';
import { Sparkles, User, GraduationCap, Briefcase, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

interface FormProps {
  initialProfile: Partial<BeneficiaryProfile>;
  onSubmitProfile: (profile: BeneficiaryProfile) => void;
}

export default function BeneficiaryOnboarding({ initialProfile, onSubmitProfile }: FormProps) {
  const [formData, setFormData] = useState<BeneficiaryProfile>({
    name: initialProfile.name || 'Ravi Kumar',
    age: initialProfile.age || 26,
    gender: initialProfile.gender || 'Male',
    state: initialProfile.state || 'Andhra Pradesh',
    district: initialProfile.district || 'Vizianagaram',
    areaType: initialProfile.areaType || 'Rural',
    education: initialProfile.education || '10th Pass',
    currentOccupation: initialProfile.currentOccupation || 'Local Stitching Worker',
    existingSkills: initialProfile.existingSkills || ['Basic Tailoring', 'Garment Finishing'],
    workExperienceYears: initialProfile.workExperienceYears || 2,
    monthlyIncome: initialProfile.monthlyIncome || '₹4,000 – ₹7,000',
    preferredLivelihood: initialProfile.preferredLivelihood || 'Self-employment',
    interests: initialProfile.interests || ['Garment Design', 'Boutique Setup'],
    careerGoal: initialProfile.careerGoal || 'Establish a home-based garment stitching unit with PM-AJAY GIA toolkit grant.'
  });

  const [skillsInput, setSkillsInput] = useState(formData.existingSkills.join(', '));
  const [interestsInput, setInterestsInput] = useState(formData.interests.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const cleanedInterests = interestsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const updated: BeneficiaryProfile = {
      ...formData,
      existingSkills: cleanedSkills.length > 0 ? cleanedSkills : ['General Skills'],
      interests: cleanedInterests.length > 0 ? cleanedInterests : ['Livelihood Growth']
    };

    onSubmitProfile(updated);
  };

  return (
    <div className="w-full mx-auto max-w-4xl px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} />
          <span>SC Beneficiary Profile Onboarding</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-serif text-slate-100">
          Beneficiary Information Form
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Review and update profile details to calculate exact NSQF course matches and PM-AJAY GIA livelihood grants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Section 1: Personal Info */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <User size={18} className="text-emerald-400" />
            <span>Personal & Geographic Details</span>
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Area Classification
              </label>
              <select
                value={formData.areaType}
                onChange={(e) => setFormData({ ...formData, areaType: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              >
                <option value="Rural">Rural</option>
                <option value="Semi-Urban">Semi-Urban</option>
                <option value="Urban">Urban</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Skills */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <GraduationCap size={18} className="text-emerald-400" />
            <span>Education, Experience & Existing Skills</span>
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Education Level
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value as EducationLevel })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              >
                <option value="Below 8th">Below 8th</option>
                <option value="8th Pass">8th Pass</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="ITI / Diploma">ITI / Diploma</option>
                <option value="Graduate & Above">Graduate & Above</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Experience (Years)
              </label>
              <input
                type="number"
                value={formData.workExperienceYears}
                onChange={(e) => setFormData({ ...formData, workExperienceYears: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Existing Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Tailoring, Machine operation, Sewing"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Interests & Work Preferences
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="e.g. Garment design, Boutique shop, Organic farming"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Livelihood Preference & Goal */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase size={18} className="text-emerald-400" />
            <span>Preferred Type of Livelihood</span>
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {(['Job', 'Self-employment', 'Entrepreneurship', 'Skill training'] as LivelihoodType[]).map((type) => {
              const selected = formData.preferredLivelihood === type;
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, preferredLivelihood: type })}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs transition-all ${
                    selected
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Career Goal & Vision
            </label>
            <textarea
              rows={3}
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 font-bold text-base transition-all shadow-xl"
        >
          <span>Analyze Profile & Map NSQF Pathway</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
