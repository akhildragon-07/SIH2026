export type EducationLevel = 
  | 'Below 8th'
  | '8th Pass'
  | '10th Pass'
  | '12th Pass'
  | 'ITI / Diploma'
  | 'Graduate & Above';

export type LivelihoodType = 
  | 'Job'
  | 'Self-employment'
  | 'Entrepreneurship'
  | 'Skill training';

export interface BeneficiaryProfile {
  id?: string;
  beneficiaryId?: string; // e.g. "SC-AJAY-2026-8492"
  userId?: string; // e.g. "ravi kumar"
  dob?: string; // e.g. "15/08/1998"
  passwordHash?: string; // SHA-256 hash of DOB for secure password login
  name: string;
  phone?: string;
  email?: string;
  aadhaarLast4?: string;
  category?: 'Scheduled Caste (SC)' | 'General / Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  district: string;
  location?: string;
  areaType: 'Rural' | 'Urban' | 'Semi-Urban';
  education: EducationLevel;
  currentOccupation: string;
  existingSkills: string[];
  workExperienceYears: number;
  monthlyIncome: string;
  preferredLivelihood: LivelihoodType;
  interest?: string;
  interests: string[];
  careerGoal: string;
  preferredLanguage?: string;
  savedCourseIds?: string[];
  profileCompletionPercentage?: number;
  isBackendSynced?: boolean;
  createdAt?: string;
  updatedAt?: string;
  giaEligibilityStatus?: 'Eligible for 100% GIA Toolkit Grant' | 'Under Verification';
}

export type VoiceState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'AI_SPEAKING'
  | 'CONFIRMING'
  | 'ANALYZING'
  | 'RECOMMENDING'
  | 'ERROR';

export interface NSQFCourse {
  id: string;
  title: string;
  qpCode: string;
  nsqfLevel: number;
  sector: string;
  durationHours: number;
  durationText: string;
  eligibility: string;
  minEducation: EducationLevel;
  skillsTaught: string[];
  careerRoles: string[];
  description: string;
  certifyingBody: string;
  officialCourseUrl: string; // Official NQR / NIELIT government course URL
  source: string;
  verificationStatus: 'VERIFIED_OFFICIAL' | 'DEMO_SYNTHETIC';
  matchScore?: number;
  rationale?: string;
  matchingSkills?: string[];
  missingSkills?: string[];
  isVerifiedGovernmentData: boolean;
}

export interface LivelihoodOpportunity {
  id: string;
  title: string;
  category: LivelihoodType;
  sector: string;
  location: string;
  requiredSkills: string[];
  matchingSkills?: string[];
  incomeRange: string;
  giaSupport?: string;
  financialAssistance?: string;
  matchScore?: number;
  description: string;
  officialCourseUrl?: string;
  isVerifiedGovernmentData: boolean;
}

export interface SkillGapItem {
  skillName: string;
  importance: 'Critical' | 'Recommended' | 'Optional';
  currentProficiency: 'None' | 'Beginner' | 'Intermediate';
  targetProficiency: 'Proficient' | 'Advanced';
}

export interface SkillGapAnalysisResult {
  targetOccupation: string;
  existingSkills: string[];
  missingSkills: SkillGapItem[];
  overallMatchPercentage: number;
  prioritySkillingArea: string;
  skillingReadinessIndex: number;
}

export interface CareerRoadmapStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  duration: string;
  status: 'current' | 'upcoming' | 'completed';
  description: string;
  giaBenefit?: string;
  iconName: string;
}

export interface AnalysisResponse {
  profile: BeneficiaryProfile;
  skillGap: SkillGapAnalysisResult;
  nsqfRecommendations: NSQFCourse[];
  livelihoodRecommendations: LivelihoodOpportunity[];
  careerRoadmap: CareerRoadmapStep[];
  aiSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: string;
  extractedFields?: Partial<BeneficiaryProfile>;
  suggestedPrompts?: string[];
}

export interface AdminAnalyticsData {
  totalBeneficiaries: number;
  scBeneficiariesPercentage: number;
  totalSkillsMapped: number;
  skillGapsIdentified: number;
  nsqfCoursesRecommended: number;
  totalGiaGrantAllocatedINR: number;
  educationBreakdown: { label: string; count: number; percentage: number }[];
  topExistingSkills: { skill: string; count: number; percentage: number }[];
  topSkillGaps: { skill: string; count: number; percentage: number }[];
  livelihoodPreferences: { category: string; percentage: number }[];
  districtDistribution: { district: string; beneficiaries: number; topNeed: string }[];
  sectorDemand: { sector: string; demandPercentage: number }[];
}

export interface UserAuth {
  userId: string;
  beneficiaryId?: string;
  email: string;
  phone?: string;
  name: string;
  token?: string;
  isAuthenticated: boolean;
}

export type OpportunityType = 'training' | 'job' | 'apprenticeship' | 'livelihood';
export type OpportunityCareerGoal = 'job' | 'self-employment' | 'entrepreneurship';

export interface Opportunity {
  id: string;
  opportunity_id?: string;
  name: string;
  title?: string;
  type: OpportunityType;
  livelihood_type?: string;
  livelihoodType?: string;
  state: string;
  district: string;
  block?: string;
  city: string;
  organization?: string;
  sector?: string;
  jobRole?: string;
  job_role?: string;
  opportunity_type?: string;
  latitude: number;
  longitude: number;
  skills: string[];
  required_skills?: string[];
  educationRequired?: string;
  min_education?: string;
  minimum_education?: string;
  nsqfLevel?: number;
  nsqf_level?: number;
  salary_min?: number;
  salary_max?: number;
  openings?: number;
  training_available?: boolean;
  training_provider?: string;
  courseName?: string;
  provider?: string;
  careerGoal: OpportunityCareerGoal;
  estimatedMonthlyIncome?: number;
  salary_or_stipend?: number | string;
  distanceKm?: number;
  eligibility?: string[];
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  contact?: string;
  address?: string;
  source?: string;
  last_updated?: string;
  isVerified?: boolean;
  is_verified_government?: boolean;
  isVerifiedGovernmentData?: boolean;
}

export interface ExplainableMatchScore {
  overallScore: number;
  skillMatchPct: number;
  locationScorePct: number;
  goalMatchPct: number;
  eligibilityMatchPct: number;
  nsqfMatchPct: number;
  reasons: string[];
}

export interface OpportunityMatchResult extends Opportunity {
  matchScore: number;
  explainableScore: ExplainableMatchScore;
  calculatedDistanceKm: number;
  isWithinRadius: boolean;
  isDistrictMatch?: boolean;
}

export interface OpportunityFilterState {
  type: 'all' | OpportunityType | 'self-employment' | 'enterprise' | string;
  radiusKm: number; // 0 (all), 5, 10, 25, 50, 100
  state?: string; // 'all' or state name
  district?: string; // 'all' or district name
  sector?: string; // 'all' or sector name
  jobRole?: string; // 'all' or job role
  nsqfLevel?: number | 'all';
  minSalary?: number;
  maxSalary?: number;
  salaryMin?: number;
  salaryMax?: number;
  onlyMyDistrict?: boolean;
  skill: string; // 'all' or specific skill
  careerGoal: 'all' | 'job' | 'self-employment' | 'entrepreneurship';
  searchQuery: string;
}

export interface DistrictOpportunityStats {
  district: string;
  state: string;
  total: number;
  training: number;
  job: number;
  apprenticeship: number;
  livelihood: number;
  topSkills: { skill: string; demand: number }[];
  density: 'high' | 'medium' | 'low';
  skillGapNotes?: string;
}

