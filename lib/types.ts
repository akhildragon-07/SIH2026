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
  userId?: string;
  name: string;
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
}

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
  isVerifiedGovernmentData: boolean;
}

export interface LivelihoodOpportunity {
  id: string;
  title: string;
  category: LivelihoodType;
  sector: string;
  location: string;
  requiredSkills: string[];
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

export interface UserAuth {
  userId: string;
  email: string;
  name: string;
  token?: string;
}
