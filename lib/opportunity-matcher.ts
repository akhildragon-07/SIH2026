import {
  Opportunity,
  BeneficiaryProfile,
  NSQFCourse,
  OpportunityMatchResult,
  OpportunityFilterState,
  ExplainableMatchScore,
  EducationLevel
} from './types';
import { OPPORTUNITIES_DATASET } from './opportunity-data';
import { getDistrictCentroid, normalizeStateName, normalizeDistrictName } from './india-locations';

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
const EDUCATION_RANK: Record<string, number> = {
  'Below 8th': 1,
  '8th': 2,
  '8th Pass': 2,
  '10th': 3,
  '10th Pass': 3,
  '12th': 4,
  '12th Pass': 4,
  'ITI': 5,
  'Diploma': 5,
  'ITI / Diploma': 5,
  'Graduate': 6,
  'Graduate & Above': 6,
  'Post Graduate': 7
};

function parseEducationRank(eduStr?: string): number {
  if (!eduStr) return 1;
  const lower = eduStr.toLowerCase();
  if (lower.includes('post') || lower.includes('master')) return 7;
  if (lower.includes('grad') || lower.includes('degree')) return 6;
  if (lower.includes('iti') || lower.includes('diploma')) return 5;
  if (lower.includes('12')) return 4;
  if (lower.includes('10')) return 3;
  if (lower.includes('8')) return 2;
  return 1;
}

/**
 * Get coordinates for a beneficiary from profile or district centroid lookup
 */
export function getBeneficiaryCoordinates(profile: BeneficiaryProfile): { latitude: number; longitude: number } {
  const normState = normalizeStateName(profile.state || '');
  const normDist = normalizeDistrictName(profile.district || '');

  const centroid = getDistrictCentroid(normState, normDist);
  if (centroid) {
    return {
      latitude: centroid.lat,
      longitude: centroid.lng
    };
  }

  // Fallback default: Theni, Tamil Nadu
  return { latitude: 10.0104, longitude: 77.4768 };
}

/**
 * 6-Factor Opportunity Scoring & Explainable AI Generator
 *
 * Weighting:
 * - 40% Job & Skill Match
 * - 20% Education & NSQF Eligibility
 * - 15% Experience Alignment
 * - 10% Interest Alignment
 * - 10% District Match
 * - 5% Haversine Distance Proximity
 */
export function calculateOpportunityScore(
  profile: BeneficiaryProfile,
  opportunity: Opportunity,
  distanceKm: number,
  nsqfRecommendations: NSQFCourse[] = []
): { score: number; explainable: ExplainableMatchScore; isDistrictMatch: boolean } {
  const reasons: string[] = [];

  // 1. Skill Match (40%)
  const userSkills = (profile.existingSkills || []).map((s) => s.toLowerCase().trim()).filter(Boolean);
  const oppSkills = (opportunity.skills || []).map((s) => s.toLowerCase().trim()).filter(Boolean);
  const oppRoleText = `${opportunity.jobRole || ''} ${opportunity.name || ''} ${opportunity.sector || ''} ${opportunity.description || ''}`.toLowerCase();

  let matchedSkills: string[] = [];
  userSkills.forEach((uSkill) => {
    oppSkills.forEach((oSkill) => {
      if (uSkill.includes(oSkill) || oSkill.includes(uSkill)) {
        if (!matchedSkills.includes(oSkill)) matchedSkills.push(oSkill);
      }
    });
    if (oppRoleText.includes(uSkill) && !matchedSkills.includes(uSkill)) {
      matchedSkills.push(uSkill);
    }
  });

  let skillMatchPct = 35;
  if (matchedSkills.length >= 3) skillMatchPct = 98;
  else if (matchedSkills.length === 2) skillMatchPct = 90;
  else if (matchedSkills.length === 1) skillMatchPct = 80;
  else {
    // Check broad sector/role match
    const anyPartial = userSkills.some((s) => oppRoleText.includes(s));
    if (anyPartial) skillMatchPct = 70;
  }

  if (matchedSkills.length > 0) {
    const capitalized = matchedSkills.slice(0, 2).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
    reasons.push(`✓ Matches your skills in ${capitalized} (${skillMatchPct}% alignment)`);
  } else {
    reasons.push(`✓ Provides foundational training and skill building for this role`);
  }

  // 2. Education & NSQF Eligibility (20%)
  const userEduRank = EDUCATION_RANK[profile.education] || parseEducationRank(profile.education);
  const oppEduRank = parseEducationRank(opportunity.educationRequired || opportunity.min_education);

  let eligibilityMatchPct = 80;
  if (userEduRank >= oppEduRank) {
    eligibilityMatchPct = 98;
    reasons.push(`✓ Meets minimum education criteria (${profile.education || 'Eligible'})`);
  } else {
    eligibilityMatchPct = 65;
    reasons.push(`✓ Special bridge admission / RPL pathway available under PM-AJAY`);
  }

  const oppNsqf = opportunity.nsqfLevel || opportunity.nsqf_level || 3;
  let nsqfMatchPct = 85;
  const matchedCourse = nsqfRecommendations.find((rc) => {
    const rcTitle = rc.title.toLowerCase();
    const rcQp = rc.qpCode.toLowerCase();
    return oppRoleText.includes(rcTitle) || oppRoleText.includes(rcQp);
  });
  if (matchedCourse) {
    nsqfMatchPct = 96;
    reasons.push(`✓ Aligned with recommended NSQF qualification (${matchedCourse.qpCode || matchedCourse.title})`);
  } else {
    reasons.push(`✓ NSQF Level ${oppNsqf} certified skill pathway`);
  }

  const eduAndNsqfScore = 0.6 * eligibilityMatchPct + 0.4 * nsqfMatchPct;

  // 3. Experience Alignment (15%)
  const userExp = profile.workExperienceYears || 0;
  let expScorePct = 70;
  if (oppNsqf <= 3) {
    expScorePct = userExp >= 0 ? 95 : 80;
  } else if (oppNsqf === 4) {
    expScorePct = userExp >= 1 ? 95 : 80;
  } else {
    expScorePct = userExp >= 2 ? 95 : 75;
  }
  reasons.push(`✓ Experience level suited (${userExp} year${userExp === 1 ? '' : 's'})`);

  // 4. Interest Alignment (10%)
  const userInterests = [
    ...(profile.interests || []),
    ...(profile.interest ? [profile.interest] : []),
    ...(profile.careerGoal ? [profile.careerGoal] : [])
  ].map((i) => i.toLowerCase().trim()).filter(Boolean);

  let interestMatchPct = 60;
  const oppSector = (opportunity.sector || '').toLowerCase();
  const hasInterestMatch = userInterests.some((int) => 
    oppRoleText.includes(int) || oppSector.includes(int) || (int.includes('auto') && oppSector.includes('auto')) ||
    (int.includes('elect') && oppSector.includes('power')) || (int.includes('tailor') && oppSector.includes('apparel')) ||
    (int.includes('food') && oppSector.includes('food'))
  );

  if (hasInterestMatch) {
    interestMatchPct = 95;
    reasons.push(`✓ Matches your interest in ${opportunity.sector || 'this domain'}`);
  } else {
    interestMatchPct = 70;
  }

  // 5. District Match (10%)
  const userStateNorm = normalizeStateName(profile.state || '');
  const userDistNorm = normalizeDistrictName(profile.district || '');
  const oppStateNorm = normalizeStateName(opportunity.state || '');
  const oppDistNorm = normalizeDistrictName(opportunity.district || '');

  const isExactDistrict = Boolean(userDistNorm && oppDistNorm && userDistNorm.toLowerCase() === oppDistNorm.toLowerCase());
  const isExactState = Boolean(userStateNorm && oppStateNorm && userStateNorm.toLowerCase() === oppStateNorm.toLowerCase());

  let districtMatchPct = 10;
  if (isExactDistrict) {
    districtMatchPct = 100;
    reasons.push(`✓ Located right in your home district (${opportunity.district})`);
  } else if (isExactState) {
    districtMatchPct = 50;
    reasons.push(`✓ Located in your state (${opportunity.state})`);
  } else {
    districtMatchPct = 20;
  }

  // 6. Haversine Distance Proximity (5%)
  let distanceScorePct = 10;
  if (distanceKm <= 10) distanceScorePct = 100;
  else if (distanceKm <= 25) distanceScorePct = 80;
  else if (distanceKm <= 50) distanceScorePct = 60;
  else if (distanceKm <= 100) distanceScorePct = 30;
  else distanceScorePct = 10;

  reasons.push(`✓ Distance: ~${distanceKm} km from ${profile.district || 'district center'}`);

  // Calculate Weighted Total Score
  const rawScore =
    0.40 * skillMatchPct +
    0.20 * eduAndNsqfScore +
    0.15 * expScorePct +
    0.10 * interestMatchPct +
    0.10 * districtMatchPct +
    0.05 * distanceScorePct;

  const finalScore = Math.min(99, Math.max(50, Math.round(rawScore)));

  // Goal match percentage for explainability
  const goalMatchPct = Math.round(
    (opportunity.careerGoal === 'job' && (profile.preferredLivelihood === 'Job' || (profile.careerGoal || '').toLowerCase().includes('job'))) ||
    (opportunity.careerGoal !== 'job' && profile.preferredLivelihood !== 'Job')
      ? 95
      : 75
  );

  const explainable: ExplainableMatchScore = {
    overallScore: finalScore,
    skillMatchPct: Math.round(skillMatchPct),
    locationScorePct: Math.round(0.67 * districtMatchPct + 0.33 * distanceScorePct),
    goalMatchPct,
    eligibilityMatchPct: Math.round(eligibilityMatchPct),
    nsqfMatchPct: Math.round(nsqfMatchPct),
    reasons
  };

  return { score: finalScore, explainable, isDistrictMatch: isExactDistrict };
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

    const { score, explainable, isDistrictMatch } = calculateOpportunityScore(
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
      isWithinRadius: dist <= 50,
      isDistrictMatch
    };
  });

  // Sort by Match Score descending, then by distance ascending
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
    // 1. "In My District" / onlyMyDistrict filter
    if (filters.onlyMyDistrict && !opp.isDistrictMatch) {
      return false;
    }

    // 2. State filter
    if (filters.state && filters.state !== 'all') {
      const targetState = normalizeStateName(filters.state);
      const oppState = normalizeStateName(opp.state);
      if (targetState !== oppState) return false;
    }

    // 3. District filter
    if (filters.district && filters.district !== 'all') {
      const targetDistrict = normalizeDistrictName(filters.district);
      const oppDistrict = normalizeDistrictName(opp.district);
      if (targetDistrict !== oppDistrict) return false;
    }

    // 4. Sector filter
    if (filters.sector && filters.sector !== 'all') {
      const targetSector = filters.sector.toLowerCase();
      const oppSector = (opp.sector || '').toLowerCase();
      if (!oppSector.includes(targetSector)) return false;
    }

    // 5. Job Role filter
    if (filters.jobRole && filters.jobRole !== 'all') {
      const targetRole = filters.jobRole.toLowerCase();
      const oppRole = (opp.jobRole || opp.name || '').toLowerCase();
      if (!oppRole.includes(targetRole)) return false;
    }

    // 6. NSQF Level filter
    if (filters.nsqfLevel && filters.nsqfLevel !== 'all') {
      const oppNsqf = opp.nsqfLevel || opp.nsqf_level;
      if (oppNsqf !== Number(filters.nsqfLevel)) return false;
    }

    // 7. Distance Radius filter (0 = all / no radius limit)
    if (filters.radiusKm && filters.radiusKm > 0 && opp.calculatedDistanceKm > filters.radiusKm) {
      return false;
    }

    // 8. Salary Range filter
    const minSal = filters.salaryMin || filters.minSalary;
    const maxSal = filters.salaryMax || filters.maxSalary;
    if (minSal && minSal > 0) {
      const oppSalary = opp.estimatedMonthlyIncome || (opp.salary_min && opp.salary_max ? Math.round((opp.salary_min + opp.salary_max) / 2) : (opp.salary_min || opp.salary_max || 0));
      if (oppSalary < minSal) return false;
    }
    if (maxSal && maxSal > 0) {
      const oppSalary = opp.estimatedMonthlyIncome || (opp.salary_min && opp.salary_max ? Math.round((opp.salary_min + opp.salary_max) / 2) : (opp.salary_min || opp.salary_max || 0));
      if (oppSalary > maxSal) return false;
    }

    // 9. Type filter
    if (filters.type && filters.type !== 'all') {
      const targetType = filters.type.toLowerCase();
      if (targetType === 'self-employment' || targetType === 'enterprise' || targetType === 'livelihood') {
        if (opp.type !== 'livelihood' && opp.careerGoal !== 'self-employment' && opp.careerGoal !== 'entrepreneurship') {
          return false;
        }
      } else if (opp.type !== targetType && (opp.livelihood_type || '').toLowerCase() !== targetType) {
        return false;
      }
    }

    // 10. Skill filter
    if (filters.skill && filters.skill !== 'all') {
      const targetSkill = filters.skill.toLowerCase();
      const hasSkill = opp.skills.some((s) => s.toLowerCase().includes(targetSkill));
      const hasName = opp.name.toLowerCase().includes(targetSkill);
      const hasCourse = (opp.courseName || '').toLowerCase().includes(targetSkill);
      if (!hasSkill && !hasName && !hasCourse) {
        return false;
      }
    }

    // 11. Career Goal filter
    if (filters.careerGoal && filters.careerGoal !== 'all') {
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

    // 12. Search query text
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const searchable = `${opp.name} ${opp.skills.join(' ')} ${opp.courseName || ''} ${opp.provider || ''} ${opp.district} ${opp.city} ${opp.state} ${opp.sector || ''} ${opp.description || ''}`.toLowerCase();
      if (!searchable.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get district-wise summary statistics for Admin dashboard and Analytics
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
    const key = `${opp.state}:${opp.district}`;
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
      .sort((a: any, b: any) => (b[1] as number) - (a[1] as number))
      .slice(0, 4)
      .map(([sk]) => sk);

    item.topSkills = sortedSkills.length > 0 ? sortedSkills : ['Automotive', 'Agriculture', 'Electrical', 'Tailoring'];
    item.density = item.total >= 5 ? 'High' : item.total >= 3 ? 'Medium' : 'Low';

    // Also populate plain district key if not already set
    if (!statsMap[item.district]) {
      statsMap[item.district] = item;
    }
  });

  return statsMap;
}
