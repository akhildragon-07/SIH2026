import { BeneficiaryProfile, AnalysisResponse, NSQFCourse, LivelihoodOpportunity, SkillGapAnalysisResult, CareerRoadmapStep, EducationLevel } from './types';
import { NSQF_COURSES_DATASET } from './nsqf-data';
import { LIVELIHOOD_OPPORTUNITIES_DATASET } from './livelihood-data';

const EDUCATION_WEIGHTS: Record<EducationLevel, number> = {
  'Below 8th': 1,
  '8th Pass': 2,
  '10th Pass': 3,
  '12th Pass': 4,
  'ITI / Diploma': 4,
  'Graduate & Above': 5
};

export function analyzeBeneficiaryProfile(profile: BeneficiaryProfile): AnalysisResponse {
  const userEduRank = EDUCATION_WEIGHTS[profile.education] || 2;
  const userSkillsLower = profile.existingSkills.map(s => s.toLowerCase());

  // 1. Calculate NSQF Course Match Scores
  const nsqfRecommendations: NSQFCourse[] = NSQF_COURSES_DATASET.map(course => {
    const courseEduRank = EDUCATION_WEIGHTS[course.minEducation] || 2;
    let score = 50; // Base score

    // Education Eligibility check
    if (userEduRank >= courseEduRank) {
      score += 25;
    } else {
      score -= 20; // Does not meet minimum education requirement
    }

    // Skill Overlap check
    let matchingSkillsCount = 0;
    course.skillsTaught.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (userSkillsLower.some(us => us.includes(skillLower) || skillLower.includes(us))) {
        matchingSkillsCount++;
      }
    });

    const skillRatio = course.skillsTaught.length > 0 ? matchingSkillsCount / course.skillsTaught.length : 0;
    score += Math.round(skillRatio * 20);

    // Sector & Interest Alignment
    const isSectorMatch = profile.interests.some(interest => 
      course.sector.toLowerCase().includes(interest.toLowerCase()) || 
      course.title.toLowerCase().includes(interest.toLowerCase()) ||
      profile.currentOccupation.toLowerCase().includes(course.sector.toLowerCase())
    );
    if (isSectorMatch) {
      score += 10;
    }

    const finalMatchScore = Math.min(98, Math.max(45, score));

    // Transparent Rationale
    let rationale = `Matched based on your ${profile.education} background`;
    if (matchingSkillsCount > 0) {
      rationale += ` and existing experience in ${userSkillsLower.slice(0, 2).join(', ')}`;
    }
    if (isSectorMatch) {
      rationale += `, aligning with your goal of ${profile.careerGoal}`;
    }

    return {
      ...course,
      matchScore: finalMatchScore,
      rationale
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Take top 4 NSQF recommendations
  const topNSQF = nsqfRecommendations.slice(0, 4);
  const primaryTargetCourse = topNSQF[0] || nsqfRecommendations[0];

  // 2. Skill Gap Analysis
  const targetRequiredSkills = primaryTargetCourse.skillsTaught;
  const missingSkills = targetRequiredSkills
    .filter(skill => !userSkillsLower.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)))
    .map((skillName, idx) => ({
      skillName,
      importance: idx === 0 ? ('Critical' as const) : idx === 1 ? ('Recommended' as const) : ('Optional' as const),
      currentProficiency: 'None' as const,
      targetProficiency: 'Proficient' as const
    }));

  const overallMatchPercentage = primaryTargetCourse.matchScore || 85;
  const skillingReadinessIndex = Math.min(95, Math.round(overallMatchPercentage * 0.95));

  const skillGap: SkillGapAnalysisResult = {
    targetOccupation: primaryTargetCourse.title,
    existingSkills: profile.existingSkills,
    missingSkills: missingSkills.length > 0 ? missingSkills : [
      { skillName: 'Advanced Business & Pricing', importance: 'Recommended', currentProficiency: 'Beginner', targetProficiency: 'Proficient' },
      { skillName: 'Digital Payments & Marketing', importance: 'Recommended', currentProficiency: 'Beginner', targetProficiency: 'Proficient' }
    ],
    overallMatchPercentage,
    prioritySkillingArea: missingSkills[0]?.skillName || 'Digital & Financial Operations',
    skillingReadinessIndex
  };

  // 3. Calculate Livelihood Opportunity Matches
  const livelihoodRecommendations: LivelihoodOpportunity[] = LIVELIHOOD_OPPORTUNITIES_DATASET.map(opp => {
    let score = 60;
    if (opp.category === profile.preferredLivelihood) {
      score += 20;
    }
    if (opp.sector.toLowerCase().includes(primaryTargetCourse.sector.toLowerCase()) || primaryTargetCourse.sector.toLowerCase().includes(opp.sector.toLowerCase())) {
      score += 15;
    }
    const matchScore = Math.min(98, Math.max(50, score));
    return {
      ...opp,
      matchScore
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // 4. Personalized Career Roadmap
  const careerRoadmap: CareerRoadmapStep[] = [
    {
      stepNumber: 1,
      title: 'Current Skill Baseline',
      subtitle: `Mapped: ${profile.existingSkills.join(', ')}`,
      duration: 'Immediate',
      status: 'completed',
      description: `Verified baseline skills from your profile (${profile.education}, ${profile.workExperienceYears} yrs experience in ${profile.state}).`,
      iconName: 'UserCheck'
    },
    {
      stepNumber: 2,
      title: 'Skill Gap & Readiness',
      subtitle: `Target Area: ${skillGap.prioritySkillingArea}`,
      duration: 'Week 1',
      status: 'current',
      description: `Focus on mastering ${skillGap.missingSkills.map(s => s.skillName).slice(0, 2).join(' & ')} to bridge the gap.`,
      iconName: 'Sparkles'
    },
    {
      stepNumber: 3,
      title: `NSQF Training: ${primaryTargetCourse.title}`,
      subtitle: `${primaryTargetCourse.durationText} · ${primaryTargetCourse.qpCode}`,
      duration: primaryTargetCourse.durationText,
      status: 'upcoming',
      description: `Undergo zero-cost NSQF Level ${primaryTargetCourse.nsqfLevel} skilling sponsored under PM-AJAY GIA scheme.`,
      giaBenefit: '100% Fee Subsidy + Skilling Stipend under PM-AJAY',
      iconName: 'GraduationCap'
    },
    {
      stepNumber: 4,
      title: 'NSQF Official Skill Certification',
      subtitle: `Certifying Body: ${primaryTargetCourse.certifyingBody}`,
      duration: 'End of Course',
      status: 'upcoming',
      description: 'Receive government-recognized NSQF Skill Certificate opening access to credit & job portals.',
      giaBenefit: 'Official NCVET Skill India Credential',
      iconName: 'Award'
    },
    {
      stepNumber: 5,
      title: profile.preferredLivelihood === 'Self-employment' ? 'PM-AJAY GIA Toolkit & Enterprise Setup' : 'Livelihood Placement',
      subtitle: `${livelihoodRecommendations[0]?.title}`,
      duration: 'Ongoing',
      status: 'upcoming',
      description: profile.preferredLivelihood === 'Self-employment' 
        ? `Receive ${livelihoodRecommendations[0]?.giaSupport || 'PM-AJAY GIA grant equipment toolkit'} to start generating ₹15,000–₹25,000 monthly income.` 
        : `Placement in ${livelihoodRecommendations[0]?.title} with expected income of ${livelihoodRecommendations[0]?.incomeRange}.`,
      giaBenefit: livelihoodRecommendations[0]?.giaSupport || 'PM-AJAY Grant Equipment Support',
      iconName: 'Briefcase'
    }
  ];

  // 5. Summary
  const aiSummary = `Based on ${profile.name}'s profile (${profile.education}, existing skills in ${profile.existingSkills.join(', ')}), we recommend the ${primaryTargetCourse.title} (${primaryTargetCourse.qpCode}, NSQF Level ${primaryTargetCourse.nsqfLevel}). Completing this training unlocks ${profile.preferredLivelihood === 'Self-employment' ? 'PM-AJAY GIA toolkit subsidy for self-employment' : 'direct job placement'} with an expected earning potential of ${livelihoodRecommendations[0]?.incomeRange || '₹15,000–₹25,000/month'}.`;

  return {
    profile,
    skillGap,
    nsqfRecommendations: topNSQF,
    livelihoodRecommendations: livelihoodRecommendations.slice(0, 3),
    careerRoadmap,
    aiSummary
  };
}

export function extractProfileFromText(transcript: string, currentProfile?: Partial<BeneficiaryProfile>): Partial<BeneficiaryProfile> {
  const text = transcript.toLowerCase();
  const extracted: Partial<BeneficiaryProfile> = { ...currentProfile };

  // Education extraction
  if (text.includes('10th') || text.includes('tenth') || text.includes('high school') || text.includes('10 pass')) {
    extracted.education = '10th Pass';
  } else if (text.includes('12th') || text.includes('twelfth') || text.includes('inter') || text.includes('higher secondary')) {
    extracted.education = '12th Pass';
  } else if (text.includes('8th') || text.includes('eighth') || text.includes('8 pass')) {
    extracted.education = '8th Pass';
  } else if (text.includes('degree') || text.includes('graduate') || text.includes('ba') || text.includes('bsc') || text.includes('bcom')) {
    extracted.education = 'Graduate & Above';
  } else if (text.includes('below 8th') || text.includes('primary school') || text.includes('uneducated')) {
    extracted.education = 'Below 8th';
  }

  // Skills extraction
  const detectedSkills: string[] = extracted.existingSkills ? [...extracted.existingSkills] : [];
  const skillKeywords: Record<string, string> = {
    'tailor': 'Tailoring',
    'stitch': 'Garment Construction',
    'sewing': 'Sewing Machine Operation',
    'computer': 'Basic Computers',
    'typing': 'Data Entry Typing',
    'mobile': 'Mobile Repairing',
    'solar': 'Solar Installation',
    'electrician': 'House Wiring',
    'farm': 'Agricultural Farming',
    'poultry': 'Backyard Poultry',
    'beauty': 'Beauty Treatments',
    'makeup': 'Bridal Grooming',
    'plumb': 'Plumbing Fitting',
    'hospital': 'Patient Assistance'
  };

  Object.entries(skillKeywords).forEach(([kw, skill]) => {
    if (text.includes(kw) && !detectedSkills.includes(skill)) {
      detectedSkills.push(skill);
    }
  });
  if (detectedSkills.length > 0) {
    extracted.existingSkills = detectedSkills;
  }

  // Preferred Livelihood extraction
  if (text.includes('business') || text.includes('own shop') || text.includes('self employment') || text.includes('home unit') || text.includes('boutique')) {
    extracted.preferredLivelihood = 'Self-employment';
  } else if (text.includes('job') || text.includes('company') || text.includes('salary') || text.includes('employment')) {
    extracted.preferredLivelihood = 'Job';
  } else if (text.includes('entrepreneur') || text.includes('startup') || text.includes('fpo') || text.includes('collective')) {
    extracted.preferredLivelihood = 'Entrepreneurship';
  } else if (text.includes('learn') || text.includes('training') || text.includes('skill')) {
    extracted.preferredLivelihood = 'Skill training';
  }

  return extracted;
}
