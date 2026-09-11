import { Opportunity } from './types';
import rawOpportunities from '../data/opportunities.json';
import { DISTRICT_COORDINATES, getDistrictCentroid } from './india-locations';

export const DEMO_DATA_DISCLAIMER = "Demo Data — Replace with verified government/API data before deployment.";
export const PM_AJAY_PATHWAY_NOTE = "This opportunity may be relevant to a PM-AJAY/GIA livelihood-support pathway, subject to applicable eligibility and approval.";

export interface DistrictCentroid {
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

// Build district centroid lookup dictionary for fast access
export const DISTRICT_CENTROIDS: Record<string, DistrictCentroid> = {};

Object.entries(DISTRICT_COORDINATES).forEach(([district, coords]) => {
  DISTRICT_CENTROIDS[district] = {
    district,
    state: coords.state,
    latitude: coords.latitude,
    longitude: coords.longitude
  };
  // Also store lowercase and state-prefixed keys for fuzzy lookup
  DISTRICT_CENTROIDS[`${coords.state.toLowerCase()}:${district.toLowerCase()}`] = {
    district,
    state: coords.state,
    latitude: coords.latitude,
    longitude: coords.longitude
  };
});

/**
 * Normalize and map raw JSON opportunities to typed Opportunity[] array
 */
function normalizeOpportunityType(typeStr?: string): 'training' | 'job' | 'apprenticeship' | 'livelihood' {
  if (!typeStr) return 'job';
  const lower = typeStr.toLowerCase().trim();
  if (lower.includes('train')) return 'training';
  if (lower.includes('apprentice')) return 'apprenticeship';
  if (lower.includes('self') || lower.includes('livelihood') || lower.includes('enterprise')) return 'livelihood';
  return 'job';
}

function normalizeCareerGoal(typeStr?: string, roleStr?: string): 'job' | 'self-employment' | 'entrepreneurship' {
  const t = (typeStr || '').toLowerCase();
  const r = (roleStr || '').toLowerCase();
  if (t.includes('self') || r.includes('self') || r.includes('boutique') || r.includes('tailor')) return 'self-employment';
  if (t.includes('enterprise') || r.includes('business') || r.includes('farming') || r.includes('poultry')) return 'entrepreneurship';
  return 'job';
}

export const OPPORTUNITIES_DATASET: Opportunity[] = (rawOpportunities as any[]).map((raw) => {
  const skillsList: string[] = typeof raw.required_skills === 'string'
    ? raw.required_skills.split(';').map((s: string) => s.trim()).filter(Boolean)
    : (Array.isArray(raw.required_skills) ? raw.required_skills : []);

  const oppType = normalizeOpportunityType(raw.opportunity_type);
  const careerGoal = normalizeCareerGoal(raw.opportunity_type, raw.job_role);
  const salaryAvg = raw.salary_min && raw.salary_max
    ? Math.round((raw.salary_min + raw.salary_max) / 2)
    : (raw.salary_min || raw.salary_max || 15000);

  const name = raw.organization ? `${raw.job_role} - ${raw.organization}` : raw.job_role;
  const description = `${raw.job_role} in ${raw.sector} sector at ${raw.organization || 'Local Enterprise'}, ${raw.block ? raw.block + ', ' : ''}${raw.district}, ${raw.state}. Required skills: ${skillsList.join(', ')}. ${raw.openings ? raw.openings + ' open positions.' : ''} ${raw.training_available ? 'Skill training provided by ' + (raw.training_provider || raw.organization) + '.' : ''}`;

  return {
    id: raw.opportunity_id || `opp-${Math.random().toString(36).substring(2, 9)}`,
    opportunity_id: raw.opportunity_id,
    name,
    title: raw.job_role,
    type: oppType,
    opportunity_type: raw.opportunity_type,
    livelihood_type: raw.opportunity_type,
    livelihoodType: raw.opportunity_type,
    state: raw.state,
    district: raw.district,
    block: raw.block,
    city: raw.block || raw.district,
    organization: raw.organization,
    sector: raw.sector,
    jobRole: raw.job_role,
    job_role: raw.job_role,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : 10.0104,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : 77.4768,
    skills: skillsList,
    required_skills: skillsList,
    educationRequired: raw.minimum_education,
    min_education: raw.minimum_education,
    minimum_education: raw.minimum_education,
    nsqfLevel: typeof raw.nsqf_level === 'number' ? raw.nsqf_level : 3,
    nsqf_level: typeof raw.nsqf_level === 'number' ? raw.nsqf_level : 3,
    salary_min: typeof raw.salary_min === 'number' ? raw.salary_min : undefined,
    salary_max: typeof raw.salary_max === 'number' ? raw.salary_max : undefined,
    openings: typeof raw.openings === 'number' ? raw.openings : undefined,
    training_available: Boolean(raw.training_available),
    training_provider: raw.training_provider || undefined,
    courseName: raw.job_role,
    provider: raw.organization || raw.training_provider || 'PM-AJAY Partner',
    careerGoal,
    estimatedMonthlyIncome: salaryAvg,
    salary_or_stipend: raw.salary_min && raw.salary_max ? `${raw.salary_min} - ${raw.salary_max} INR/month` : `${salaryAvg} INR/month`,
    eligibility: [`Minimum ${raw.minimum_education || '8th Pass'}`, `NSQF Level ${raw.nsqf_level || 3}`],
    description,
    contactPhone: raw.contact || '+91 1800-PM-AJAY',
    contact: raw.contact || '+91 1800-PM-AJAY',
    source: raw.source || 'demo',
    last_updated: raw.last_updated || '2026-09-11',
    isVerified: raw.source !== 'demo',
    is_verified_government: false,
    isVerifiedGovernmentData: false
  };
});

// Extract unique list of sectors, job roles, skills, and NSQF levels
export const AVAILABLE_SECTORS = Array.from(
  new Set(OPPORTUNITIES_DATASET.map((o) => o.sector).filter(Boolean))
).sort() as string[];

export const AVAILABLE_JOB_ROLES = Array.from(
  new Set(OPPORTUNITIES_DATASET.map((o) => o.jobRole || o.title).filter(Boolean))
).sort() as string[];

export const AVAILABLE_SKILLS_FILTER = Array.from(
  new Set(OPPORTUNITIES_DATASET.flatMap((o) => o.skills || []).filter(Boolean))
).sort() as string[];

export const AVAILABLE_NSQF_LEVELS = Array.from(
  new Set(OPPORTUNITIES_DATASET.map((o) => o.nsqfLevel || o.nsqf_level).filter((n): n is number => typeof n === 'number'))
).sort((a, b) => a - b);

