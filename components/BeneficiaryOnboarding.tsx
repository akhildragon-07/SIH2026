'use client';

import React, { useState, useEffect } from 'react';
import { BeneficiaryProfile, EducationLevel, LivelihoodType } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { startSpeechRecognition, stopSpeechRecognition, isSpeechRecognitionSupported } from '@/lib/speech';
import { Sparkles, User, GraduationCap, Briefcase, MapPin, CheckCircle2, ArrowRight, Mic, MicOff, Phone, Mail, ShieldCheck, Plus, X, RefreshCw } from 'lucide-react';

interface FormProps {
  initialProfile: Partial<BeneficiaryProfile>;
  onSubmitProfile: (profile: BeneficiaryProfile) => void;
}

const COMMON_SKILL_SUGGESTIONS = [
  'Tailoring & Garment Stitching',
  'Sewing Machine Operation',
  'House Wiring & Electricals',
  'Solar Panel Installation',
  'Basic Computers & Data Entry',
  'Mobile Phone Hardware Repair',
  'Hospital Patient Care (GDA)',
  'Organic Farming & Bio-Inputs',
  'Backyard Poultry Farming',
  'Two-Wheeler Mechanic',
  'Beauty Parlour & Bridal Makeup',
  'Plumbing & Sanitation'
];

export default function BeneficiaryOnboarding({ initialProfile, onSubmitProfile }: FormProps) {
  const { registerBeneficiary, isSyncing } = useAuth();

  const [formData, setFormData] = useState<BeneficiaryProfile>({
    name: initialProfile.name || 'Ravi Kumar',
    phone: initialProfile.phone || '9848022338',
    email: initialProfile.email || 'ravi.kumar@pmajay.gov.in',
    category: initialProfile.category || 'Scheduled Caste (SC)',
    age: initialProfile.age || 26,
    gender: initialProfile.gender || 'Male',
    state: initialProfile.state || 'Andhra Pradesh',
    district: initialProfile.district || 'Vizianagaram',
    areaType: initialProfile.areaType || 'Rural',
    education: initialProfile.education || '10th Pass',
    currentOccupation: initialProfile.currentOccupation || 'Local Stitching Worker',
    existingSkills: initialProfile.existingSkills && initialProfile.existingSkills.length > 0 ? initialProfile.existingSkills : ['Tailoring', 'Sewing Machine Operation'],
    workExperienceYears: initialProfile.workExperienceYears || 2,
    monthlyIncome: initialProfile.monthlyIncome || '₹4,000 – ₹7,000',
    preferredLivelihood: initialProfile.preferredLivelihood || 'Self-employment',
    interests: initialProfile.interests && initialProfile.interests.length > 0 ? initialProfile.interests : ['Garment Design', 'Boutique Setup'],
    careerGoal: initialProfile.careerGoal || 'Establish a home-based garment stitching unit with PM-AJAY GIA toolkit grant.'
  });

  const [skillsList, setSkillsList] = useState<string[]>(
    initialProfile.existingSkills && initialProfile.existingSkills.length > 0
      ? initialProfile.existingSkills
      : ['Tailoring', 'Sewing Machine Operation']
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Active voice field recording
  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  // Sync state whenever initialProfile changes (e.g. from Voice Assistant)
  useEffect(() => {
    if (initialProfile) {
      setFormData((prev) => ({
        ...prev,
        ...initialProfile,
        name: initialProfile.name || prev.name,
        phone: initialProfile.phone || prev.phone,
        email: initialProfile.email || prev.email,
        age: initialProfile.age || prev.age,
        state: initialProfile.state || prev.state,
        district: initialProfile.district || prev.district,
        education: initialProfile.education || prev.education,
        existingSkills: initialProfile.existingSkills && initialProfile.existingSkills.length > 0 ? initialProfile.existingSkills : prev.existingSkills,
        workExperienceYears: initialProfile.workExperienceYears !== undefined ? initialProfile.workExperienceYears : prev.workExperienceYears,
        preferredLivelihood: initialProfile.preferredLivelihood || prev.preferredLivelihood,
        careerGoal: initialProfile.careerGoal || prev.careerGoal
      }));

      if (initialProfile.existingSkills && initialProfile.existingSkills.length > 0) {
        setSkillsList(initialProfile.existingSkills);
      }
    }
  }, [initialProfile]);

  useEffect(() => {
    return () => {
      stopSpeechRecognition();
    };
  }, []);

  const handleVoiceInputForField = (field: 'name' | 'skills' | 'goal' | 'occupation') => {
    if (activeVoiceField === field) {
      stopSpeechRecognition();
      setActiveVoiceField(null);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    stopSpeechRecognition();
    setActiveVoiceField(field);

    startSpeechRecognition(
      (transcript) => {
        if (field === 'name') {
          setFormData((prev) => ({ ...prev, name: transcript }));
        } else if (field === 'goal') {
          setFormData((prev) => ({ ...prev, careerGoal: transcript }));
        } else if (field === 'occupation') {
          setFormData((prev) => ({ ...prev, currentOccupation: transcript }));
        } else if (field === 'skills') {
          setCustomSkillInput(transcript);
        }
      },
      (err) => {
        console.warn('Voice field error:', err);
        setActiveVoiceField(null);
      },
      () => {
        setActiveVoiceField(null);
      },
      'English'
    );
  };

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalizedSkills = skillsList.length > 0 ? skillsList : ['General Skills'];
    const updated: BeneficiaryProfile = {
      ...formData,
      existingSkills: finalizedSkills,
      interests: formData.interests.length > 0 ? formData.interests : ['Livelihood Growth'],
      profileCompletionPercentage: 100,
      isBackendSynced: true
    };

    // Register into backend API
    const registered = await registerBeneficiary(updated);
    onSubmitProfile(registered);
  };

  return (
    <div className="w-full mx-auto max-w-4xl px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} />
          <span>PM-AJAY GIA Component · Beneficiary Registration</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-serif text-slate-100">
          Create Your Beneficiary Account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Fill your details or tap the microphone to speak. Your official PM-AJAY account and digital passbook will be generated and saved to the backend.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Section 1: Personal & Contact Info */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <User size={18} className="text-emerald-400" />
              <span>Personal & Contact Information</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              PM-AJAY Eligible
            </span>
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <span>Full Name</span>
                <button
                  type="button"
                  onClick={() => handleVoiceInputForField('name')}
                  className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border ${
                    activeVoiceField === 'name' ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-800 text-emerald-300 border-slate-700'
                  }`}
                >
                  <Mic size={12} /> {activeVoiceField === 'name' ? 'Listening...' : 'Speak'}
                </button>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ravi Kumar"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9848022338"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ravi@pmajay.gov.in"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Social Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 font-semibold text-emerald-400"
              >
                <option value="Scheduled Caste (SC)">Scheduled Caste (SC) — PM-AJAY GIA Grant</option>
                <option value="General / Other">General / Other Category</option>
              </select>
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
          </div>
        </div>

        {/* Section 2: Education, Occupation & Experience */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <GraduationCap size={18} className="text-emerald-400" />
            <span>Education & Current Experience</span>
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
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
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                <span>Current Occupation</span>
                <button
                  type="button"
                  onClick={() => handleVoiceInputForField('occupation')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  <Mic size={12} />
                </button>
              </label>
              <input
                type="text"
                value={formData.currentOccupation}
                onChange={(e) => setFormData({ ...formData, currentOccupation: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />
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
          </div>
        </div>

        {/* Section 3: Skills Mapping & Selection */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              <span>Existing Skills Mapping</span>
            </div>
            <span className="text-xs text-slate-400">
              Selected: <strong className="text-emerald-400">{skillsList.length} skills</strong>
            </span>
          </h2>

          <div className="mt-6 space-y-4">
            {/* Selected Skill Badges */}
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-slate-400">Your Active Skills List:</p>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-sm"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 text-slate-400 hover:text-rose-400"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Skill Input with Voice Mic */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                  }
                }}
                placeholder="Type or speak a custom skill (e.g. Blouse Cutting, Solar Wiring, Typing)..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() => handleVoiceInputForField('skills')}
                className={`grid size-11 place-items-center rounded-xl border ${
                  activeVoiceField === 'skills' ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                }`}
                title="Speak Skill"
              >
                {activeVoiceField === 'skills' ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <button
                type="button"
                onClick={() => handleAddSkill(customSkillInput)}
                disabled={!customSkillInput.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 px-4 py-3 text-xs font-bold transition-all shrink-0"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Quick-Pick Recommended Sector Skills */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-amber-400">💡 Quick-Add Popular Sector Skills:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILL_SUGGESTIONS.map((sug) => {
                  const isAlreadyAdded = skillsList.includes(sug);
                  return (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => (isAlreadyAdded ? handleRemoveSkill(sug) : handleAddSkill(sug))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isAlreadyAdded
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isAlreadyAdded ? '✓ ' : '+ '} {sug}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Livelihood Preference & Vision */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase size={18} className="text-emerald-400" />
            <span>Preferred Livelihood & Career Goal</span>
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {(['Self-employment', 'Job', 'Entrepreneurship', 'Skill training'] as LivelihoodType[]).map((type) => {
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
                  {type === 'Self-employment' ? '🛠️ Self-employment (Toolkit)' : type === 'Job' ? '💼 Salaried Job' : type === 'Entrepreneurship' ? '🚀 Entrepreneurship' : '🎓 Skill Training'}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              <span>Career Vision / Goal</span>
              <button
                type="button"
                onClick={() => handleVoiceInputForField('goal')}
                className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border ${
                  activeVoiceField === 'goal' ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-slate-800 text-emerald-300 border-slate-700'
                }`}
              >
                <Mic size={12} /> {activeVoiceField === 'goal' ? 'Listening...' : 'Speak Goal'}
              </button>
            </label>
            <textarea
              rows={3}
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-6 py-4 font-bold text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.01]"
          >
            {isSyncing ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Saving to Backend Database...</span>
              </>
            ) : (
              <>
                <span>Save Profile, Issue PM-AJAY Account & Map Skills</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

