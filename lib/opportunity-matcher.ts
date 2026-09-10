import {
  Opportunity,
  BeneficiaryProfile,
  NSQFCourse,
  OpportunityMatchResult,
  OpportunityFilterState,
  ExplainableMatchScore,
  EducationLevel
} from './types';
import { DISTRICT_CENTROIDS, OPPORTUNITIES_DATASET } from './opportunity-data';

/**
 * Calculates great-circle distance between two points using the Haversine formula.
 * Returns distance in kilometers (rounded to 1 decimal place).
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(1));
}

/**
 * Education level rank hierarchy for eligibility comparison
 */
const EDUCATION_RANK: Record<EducationLevel, number> = {
  'Below 8th': 1,
  '8th Pass': 2,
  '10th Pass': 3,
  '12th Pass': 4,
  'ITI / Diploma': 5,
  'Graduate & Above': 6
};

function parseEducationRank(eduStr?: string): number {
  if (!eduStr) return 1;
  const lower = eduStr.toLowerCase();
  if (lower.includes('grad') || lower.includes('degree')) return 6;
  if (lower.includes('iti') || lower.includes('diploma')) return 5;
  if (lower.includes('12')) return 4;
  if (lower.includes('10')) return 3;
  if (lower.includes('8')) return 2;
  return 1;
}

/**
 * Get coordinates for a beneficiary from profile or district lookup
 */
export function getBeneficiaryCoordinates(profile: BeneficiaryProfile): { latitude: number; longitude: number } {
  const districtKey = profile.district?.trim();
  if (districtKey && DISTRICT_CENTROIDS[districtKey]) {
    return {
      latitude: DISTRICT_CENTROIDS[districtKey].latitude,
      longitude: DISTRICT_CENTROIDS[districtKey].longitude
    };
  }

  // Search case-insensitive
  const foundKey = Object.keys(DISTRICT_CENTROIDS).find(
    (k) => k.toLowerCase() === (profile.district || '').toLowerCase().trim()
  );
  if (foundKey) {
    return {
      latitude: DISTRICT_CENTROIDS[foundKey].latitude,
      longitude: DISTRICT_CENTROIDS[foundKey].longitude
    };
  }

  // Default fallback: Theni, Tamil Nadu
  return { latitude: 10.0104, longitude: 77.4768 };
}

/**
 * 5-Factor Opportunity Scoring & Explainable AI Generator
 *
 * Opportunity Score =
 *   0.35 × Skill Match
 * + 0.25 × Location Score
 * + 0.15 × Goal Match
 * + 0.15 × Eligibility Match
 * + 0.10 × NSQF Match
 */
export function calculateOpportunityScore(
  profile: BeneficiaryProfile,
  opportunity: Opportunity,
  distanceKm: number,
  nsqfRecommendations: NSQFCourse[] = []
): { score: number; explainable: ExplainableMatchScore } {
  const reasons: string[] = [];

  // 1. Skill Match (35%)
  const userSkills = (profile.existingSkills || []).map((s) => s.toLowerCase().trim());
  const userInterests = (profile.interests || []).map((i) => i.toLowerCase().trim());
  const oppSkills = (opportunity.skills || []).map((s) => s.toLowerCase().trim());

  let matchedSkills: string[] = [];
  userSkills.forEach((uSkill) => {
    oppSkills.forEach((oSkill) => {
      if (uSkill.includes(oSkill) || oSkill.includes(uSkill)) {
        if (!matchedSkills.includes(oSkill)) matchedSkills.push(oSkill);
      }
    });
  });

  // Also check interests
  userInterests.forEach((uInt) => {
    oppSkills.forEach((oSkill) => {
      if (uInt.includes(oSkill) || oSkill.includes(uInt)) {
        if (!matchedSkills.includes(oSkill)) matchedSkills.push(oSkill);
      }
    });
  });

  let skillMatchPct = 30; // base score
  if (matchedSkills.length >= 3) skillMatchPct = 98;
  else if (matchedSkills.length === 2) skillMatchPct = 92;
  else if (matchedSkills.length === 1) skillMatchPct = 85;
  else {
    // Partial textual search
    const textCorpus = `${opportunity.name} ${opportunity.description} ${opportunity.courseName}`.toLowerCase();
    const hasAny = userSkills.some((s) => textCorpus.includes(s));
    if (hasAny) skillMatchPct = 78;
  }

  if (matchedSkills.length > 0) {
    const capitalized = matchedSkills.slice(0, 2).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    reasons.push(`✓ Matches your ${capitalized} skill (${skillMatchPct}% alignment)`);
  } else {
    reasons.push(`✓ Provides foundational training to build upon your background`);
  }

  // 2. Location Proximity Score (25%)
  let locationScorePct = 30;
  if (distanceKm <= 5) locationScorePct = 100;
  else if (distanceKm <= 10) locationScorePct = 90;
  else if (distanceKm <= 25) locationScorePct = 75;
  else if (distanceKm <= 50) locationScorePct = 55;
  else locationScorePct = 25;

  if (opportunity.district.toLowerCase() === profile.district.toLowerCase()) {
    locationScorePct = Math.min(100, locationScorePct + 10);
  }

  reasons.push(`✓ Within ${distanceKm} km in ${opportunity.city}, ${opportunity.district}`);

  // 3. Career Goal Match (15%)
  const userPref = (profile.preferredLivelihood || '').toLowerCase();
  const userGoalText = (profile.careerGoal || '').toLowerCase();
  const oppGoal = opportunity.careerGoal;

  let goalMatchPct = 60;
  if (
    (userPref.includes('self') || userGoalText.includes('self') || userGoalText.includes('boutique') || userGoalText.includes('unit')) &&
    (oppGoal === 'self-employment' || oppGoal === 'entrepreneurship' || opportunity.type === 'livelihood')
  ) {
    goalMatchPct = 100;
    reasons.push(`✓ Highly aligned with your self-employment and micro-enterprise goal`);
  } else if (
    (userPref.includes('job') || userGoalText.includes('job') || userGoalText.includes('wage')) &&
    (oppGoal === 'job' || opportunity.type === 'job' || opportunity.type === 'apprenticeship')
  ) {
    goalMatchPct = 100;
    reasons.push(`✓ Direct match for your wage employment career objective`);
  } else if (opportunity.type === 'training') {
    goalMatchPct = 92;
    reasons.push(`✓ Certified preparatory pathway to achieve your target livelihood`);
  } else {
    goalMatchPct = 75;
    reasons.push(`✓ Compatible with your skill development trajectory`);
  }

  // 4. Education & Eligibility Match (15%)
  const userEduRank = EDUCATION_RANK[profile.education] || parseEducationRank(profile.education);
  const oppEduRank = parseEducationRank(opportunity.educationRequired);

  let eligibilityMatchPct = 80;
  if (userEduRank >= oppEduRank) {
    eligibilityMatchPct = 98;
    reasons.push(`✓ Meets education criteria (${profile.education || 'Eligible'})`);
  } else {
    eligibilityMatchPct = 65;
    reasons.push(`✓ Special bridge admission available for PM-AJAY candidates`);
  }

  // 5. NSQF Course Match (10%)
  let nsqfMatchPct = 60;
  const oppCourseLower = (opportunity.courseName || '').toLowerCase();
  const matchedCourse = nsqfRecommendations.find((rc) => {
    const rcTitle = rc.title.toLowerCase();
    const rcQp = rc.qpCode.toLowerCase();
    return oppCourseLower.includes(rcTitle) || oppCourseLower.includes(rcQp) || rcTitle.includes(opportunity.name.toLowerCase());
  });

  if (matchedCourse) {
    nsqfMatchPct = 96;
    reasons.push(`✓ Linked to recommended NSQF qualification (${matchedCourse.qpCode || matchedCourse.title})`);
  } else if (opportunity.nsqfLevel) {
    nsqfMatchPct = 85;
    reasons.push(`✓ Certified NSQF Level ${opportunity.nsqfLevel} accredited curriculum`);
  } else {
    nsqfMatchPct = 70;
    reasons.push(`✓ Recognized skill development and livelihood support program`);
  }

  // Calculate Weighted Total Score
  const rawScore =
    0.35 * skillMatchPct +
    0.25 * locationScorePct +
    0.15 * goalMatchPct +
    0.15 * eligibilityMatchPct +
    0.10 * nsqfMatchPct;

  const finalScore = Math.min(99, Math.max(50, Math.round(rawScore)));

  const explainable: ExplainableMatchScore = {
    overallScore: finalScore,
    skillMatchPct: Math.round(skillMatchPct),
    locationScorePct: Math.round(locationScorePct),
    goalMatchPct: Math.round(goalMatchPct),
    eligibilityMatchPct: Math.round(eligibilityMatchPct),
    nsqfMatchPct: Math.round(nsqfMatchPct),
    reasons
  };

  return { score: finalScore, explainable };
}

/**
 * Match and rank all opportunities for a beneficiary with distance and scoring
 */
export function matchOpportunities(
  profile: BeneficiaryProfile,
  opportunities: Opportunity[] = OPPORTUNITIES_DATASET,
  nsqfRecommendations: NSQFCourse[] = []
): OpportunityMatchResult[] {
  const beneficiaryCoords = getBeneficiaryCoordinates(profile);

  const scoredList: OpportunityMatchResult[] = opportunities.map((opp) => {
    const dist = calculateDistance(
      beneficiaryCoords.latitude,
      beneficiaryCoords.longitude,
      opp.latitude,
      opp.longitude
    );

    const { score, explainable } = calculateOpportunityScore(
      profile,
      opp,
      dist,
      nsqfRecommendations
    );

    return {
      ...opp,
      calculatedDistanceKm: dist,
      matchScore: score,
      explainableScore: explainable,
      isWithinRadius: dist <= 50
    };
  });

  // Sort by Match Score descending, then distance ascending
  return scoredList.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.calculatedDistanceKm - b.calculatedDistanceKm;
  });
}

/**
 * Filter opportunities according to interactive filter controls
 */
export function filterOpportunities(
  opportunities: OpportunityMatchResult[],
  filters: OpportunityFilterState
): OpportunityMatchResult[] {
  return opportunities.filter((opp) => {
    // 1. Distance Radius filter
    if (filters.radiusKm > 0 && opp.calculatedDistanceKm > filters.radiusKm) {
      return false;
    }

    // 2. Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'self-employment' || filters.type === 'enterprise') {
        if (opp.type !== 'livelihood' && opp.careerGoal !== 'self-employment' && opp.careerGoal !== 'entrepreneurship') {
          return false;
        }
      } else if (opp.type !== filters.type) {
        return false;
      }
    }

    // 3. Skill filter
    if (filters.skill !== 'all') {
      const targetSkill = filters.skill.toLowerCase();
      const hasSkill = opp.skills.some((s) => s.toLowerCase().includes(targetSkill));
      const hasName = opp.name.toLowerCase().includes(targetSkill);
      const hasCourse = (opp.courseName || '').toLowerCase().includes(targetSkill);
      if (!hasSkill && !hasName && !hasCourse) {
        return false;
      }
    }

    // 4. Career Goal filter
    if (filters.careerGoal !== 'all') {
      if (filters.careerGoal === 'job') {
        if (opp.careerGoal !== 'job' && opp.type !== 'job' && opp.type !== 'apprenticeship') {
          return false;
        }
      } else if (filters.careerGoal === 'self-employment') {
        if (opp.careerGoal !== 'self-employment' && opp.type !== 'livelihood') {
          return false;
        }
      } else if (filters.careerGoal === 'entrepreneurship') {
        if (opp.careerGoal !== 'entrepreneurship' && opp.type !== 'livelihood') {
          return false;
        }
      }
    }

    // 5. Search query text
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const searchable = `${opp.name} ${opp.skills.join(' ')} ${opp.courseName || ''} ${opp.provider || ''} ${opp.district} ${opp.city} ${opp.state} ${opp.description || ''}`.toLowerCase();
      if (!searchable.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get district-wise summary statistics for Admin dashboard
 */
export function getDistrictOpportunityStats(): Record<string, {
  district: string;
  state: string;
  total: number;
  training: number;
  job: number;
  apprenticeship: number;
  livelihood: number;
  topSkills: string[];
  density: 'High' | 'Medium' | 'Low';
}> {
  const statsMap: Record<string, any> = {};

  OPPORTUNITIES_DATASET.forEach((opp) => {
    const key = opp.district;
    if (!statsMap[key]) {
      statsMap[key] = {
        district: opp.district,
        state: opp.state,
        total: 0,
        training: 0,
        job: 0,
        apprenticeship: 0,
        livelihood: 0,
        skillsCount: {} as Record<string, number>,
        density: 'Medium'
      };
    }

    statsMap[key].total += 1;
    if (opp.type === 'training') statsMap[key].training += 1;
    else if (opp.type === 'job') statsMap[key].job += 1;
    else if (opp.type === 'apprenticeship') statsMap[key].apprenticeship += 1;
    else if (opp.type === 'livelihood') statsMap[key].livelihood += 1;

    opp.skills.forEach((sk) => {
      statsMap[key].skillsCount[sk] = (statsMap[key].skillsCount[sk] || 0) + 1;
    });
  });

  // Post-process top skills and density
  Object.keys(statsMap).forEach((d) => {
    const item = statsMap[d];
    const sortedSkills = Object.entries(item.skillsCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 4)
      .map(([sk]) => sk);

    item.topSkills = sortedSkills.length > 0 ? sortedSkills : ['Tailoring', 'Agriculture', 'Electrical', 'Food Processing'];
    item.density = item.total >= 5 ? 'High' : item.total >= 3 ? 'Medium' : 'Low';
  });

  return statsMap;
}
