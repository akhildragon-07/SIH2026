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
  areaType: 'Rural' | 'Urban' | 'Semi-Urban';
  education: EducationLevel;
  currentOccupation: string;
  existingSkills: string[];
  workExperienceYears: number;
  monthlyIncome: string;
  preferredLivelihood: LivelihoodType;
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
  name: string;
  type: OpportunityType;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  skills: string[];
  educationRequired?: string;
  nsqfLevel?: number;
  courseName?: string;
  provider?: string;
  careerGoal: OpportunityCareerGoal;
  estimatedMonthlyIncome?: number;
  distanceKm?: number;
  eligibility?: string[];
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  isVerified?: boolean;
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
}

export interface OpportunityFilterState {
  type: 'all' | OpportunityType | 'self-employment' | 'enterprise';
  radiusKm: number; // 5, 10, 25, 50
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

