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

// Multi-domain synonym & skill ontology dictionary
const SKILL_SYNONYMS: Record<string, string[]> = {
  'tailoring': ['tailor', 'sewing', 'stitching', 'cutting', 'fabric cutting', 'garment', 'cloth', 'pattern making', 'boutique', 'dressmaking', 'embroidery', 'ब्लाउज', 'सिलाई', 'కుట్టు', 'தையல்', 'शिवणकाम'],
  'sewing': ['sewing machine', 'stitching', 'tailor', 'garment assembly', 'lockstitch', 'needle'],
  'wiring': ['house wiring', 'electrician', 'assistant electrician', 'electrical', 'switchboard', 'circuit', 'conduit', 'power', 'बिजली', 'వైరింగ్', 'மின்சாரம்'],
  'solar': ['solar installer', 'suryamitra', 'pv panel', 'solar rooftop', 'clean energy', 'inverter', 'green jobs', 'सोलर'],
  'mobile repair': ['mobile', 'phone', 'smartphone', 'smd soldering', 'pcb diagnostics', 'display replacement', 'hardware repair', 'মোবাইল', 'మోబైల్'],
  'computer': ['basic computers', 'ms office', 'excel', 'word', 'typing', 'data entry', 'ccc', 'nielit', 'internet', 'e-governance', 'digital', 'कंप्यूटर', 'కంప్యూటర్'],
  'typing': ['data entry', 'alphanumeric typing', 'word processing', 'data operator', 'deo', 'office assistant'],
  'patient care': ['nursing', 'gda', 'general duty assistant', 'hospital', 'bedside care', 'first aid', 'hygiene', 'vital signs', 'eldercare', 'स्वास्थ्य'],
  'farming': ['organic grower', 'agriculture', 'crops', 'vermi-composting', 'soil health', 'poultry', 'backyard poultry', 'livestock', 'dairy', 'खेती', 'వ్యవసాయం', 'விவசாயம்'],
  'poultry': ['poultry farming', 'chicken', 'egg production', 'brooding', 'hatchery', 'chicks', 'मुर्गी पालन', 'కోళ్ళ పెంపకం'],
  'mechanic': ['automotive', 'two wheeler', 'bike repair', 'engine overhauling', 'brake servicing', 'garage', 'ev vehicle', 'मैकेनिक', 'మెకానిక్'],
  'beauty': ['beauty therapist', 'makeup', 'bridal makeup', 'facial', 'hair styling', 'salon', 'parlour', 'grooming', 'ब्यूटी', 'అందం'],
  'plumbing': ['plumber', 'pipe fitting', 'pvc jointing', 'sanitary', 'water pump', 'drainage', 'नल', 'ప్లంబర్']
};

/**
 * Checks if two skill concepts semantically match based on the domain ontology.
 */
function skillsMatch(userSkill: string, targetSkill: string): boolean {
  const u = userSkill.toLowerCase().trim();
  const t = targetSkill.toLowerCase().trim();

  if (u === t || u.includes(t) || t.includes(u)) return true;

  for (const [key, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    const isUserInGroup = u.includes(key) || synonyms.some(s => u.includes(s) || s.includes(u));
    const isTargetInGroup = t.includes(key) || synonyms.some(s => t.includes(s) || s.includes(t));
    if (isUserInGroup && isTargetInGroup) {
      return true;
    }
  }

  return false;
}

export function analyzeBeneficiaryProfile(profile: BeneficiaryProfile): AnalysisResponse {
  const userEduRank = EDUCATION_WEIGHTS[profile.education] || 3;
  const userSkills = profile.existingSkills && profile.existingSkills.length > 0
    ? profile.existingSkills
    : ['Basic Skills'];
  const userInterests = profile.interests || [];

  // 1. NSQF Course Matching with Multi-factor Scoring
  const nsqfRecommendations: NSQFCourse[] = NSQF_COURSES_DATASET.map(course => {
    const courseEduRank = EDUCATION_WEIGHTS[course.minEducation] || 2;
    let score = 40; // Base score

    // Factor A: Education Eligibility (25 pts max)
    if (userEduRank >= courseEduRank) {
      score += 25;
    } else {
      score -= 15; // Does not meet minimum education
    }

    // Factor B: Skill Overlap (35 pts max)
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    course.skillsTaught.forEach(courseSkill => {
      const isMatched = userSkills.some(uSkill => skillsMatch(uSkill, courseSkill));
      if (isMatched) {
        matchingSkills.push(courseSkill);
      } else {
        missingSkills.push(courseSkill);
      }
    });

    const matchRatio = course.skillsTaught.length > 0 ? matchingSkills.length / course.skillsTaught.length : 0;
    score += Math.round(matchRatio * 30);

    // If user has direct skill in this domain, guarantee high alignment
    const hasDomainOverlap = userSkills.some(uSkill =>
      skillsMatch(uSkill, course.title) ||
      skillsMatch(uSkill, course.sector) ||
      course.skillsTaught.some(st => skillsMatch(uSkill, st))
    );
    if (hasDomainOverlap) {
      score += 15;
    }

    // Factor C: Sector & Career Goal Match (15 pts max)
    const isSectorMatch = userInterests.some(i =>
      course.sector.toLowerCase().includes(i.toLowerCase()) ||
      course.title.toLowerCase().includes(i.toLowerCase())
    ) || course.sector.toLowerCase().includes(profile.currentOccupation.toLowerCase());

    if (isSectorMatch) {
      score += 10;
    }

    // Factor D: Preferred Livelihood Alignment (10 pts)
    const courseIsSelfEmployment = course.title.toLowerCase().includes('self') || course.careerRoles.some(r => r.toLowerCase().includes('owner') || r.toLowerCase().includes('independent'));
    if (profile.preferredLivelihood === 'Self-employment' && courseIsSelfEmployment) {
      score += 8;
    } else if (profile.preferredLivelihood === 'Job' && !courseIsSelfEmployment) {
      score += 8;
    }

    const finalMatchScore = Math.min(99, Math.max(50, score));

    // Transparent Rationale
    let rationale = `Matched based on your ${profile.education} qualification`;
    if (matchingSkills.length > 0) {
      rationale += ` and verified strength in ${matchingSkills.slice(0, 2).join(', ')}`;
    } else if (hasDomainOverlap) {
      rationale += ` and background in ${userSkills.slice(0, 2).join(', ')}`;
    }
    if (isSectorMatch) {
      rationale += `, supporting your goal of "${profile.careerGoal}"`;
    }

    return {
      ...course,
      matchScore: finalMatchScore,
      rationale,
      matchingSkills,
      missingSkills
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const topNSQF = nsqfRecommendations.slice(0, 4);
  const primaryCourse = topNSQF[0] || nsqfRecommendations[0];

  // 2. Skill Gap Analysis
  const missingSkillItems = (primaryCourse.missingSkills || primaryCourse.skillsTaught).map((skillName, idx) => ({
    skillName,
    importance: idx === 0 ? ('Critical' as const) : idx === 1 ? ('Recommended' as const) : ('Optional' as const),
    currentProficiency: 'None' as const,
    targetProficiency: 'Proficient' as const
  }));

  const overallMatchPercentage = primaryCourse.matchScore || 88;
  const skillingReadinessIndex = Math.min(96, Math.max(65, Math.round(overallMatchPercentage * 0.94)));

  const skillGap: SkillGapAnalysisResult = {
    targetOccupation: primaryCourse.title,
    existingSkills: userSkills,
    missingSkills: missingSkillItems.length > 0 ? missingSkillItems : [
      { skillName: 'Advanced Commercial Operations', importance: 'Recommended', currentProficiency: 'Beginner', targetProficiency: 'Proficient' },
      { skillName: 'Digital Payments & Invoicing', importance: 'Recommended', currentProficiency: 'Beginner', targetProficiency: 'Proficient' }
    ],
    overallMatchPercentage,
    prioritySkillingArea: missingSkillItems[0]?.skillName || 'Core Technical Practice',
    skillingReadinessIndex
  };

  // 3. Livelihood Opportunity Matches
  const livelihoodRecommendations: LivelihoodOpportunity[] = LIVELIHOOD_OPPORTUNITIES_DATASET.map(opp => {
    let score = 55;

    // Livelihood type match
    if (opp.category === profile.preferredLivelihood) {
      score += 22;
    }

    // Sector match with target primary course
    if (
      opp.sector.toLowerCase().includes(primaryCourse.sector.toLowerCase()) ||
      primaryCourse.sector.toLowerCase().includes(opp.sector.toLowerCase())
    ) {
      score += 18;
    }

    // Skill overlap with opportunity required skills
    const matchingOppSkills = opp.requiredSkills.filter(req =>
      userSkills.some(uSkill => skillsMatch(uSkill, req))
    );
    if (matchingOppSkills.length > 0) {
      score += Math.min(20, matchingOppSkills.length * 7);
    }

    const matchScore = Math.min(99, Math.max(50, score));

    return {
      ...opp,
      matchScore,
      matchingSkills: matchingOppSkills
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const topLivelihood = livelihoodRecommendations.slice(0, 3);
  const primaryLivelihood = topLivelihood[0] || livelihoodRecommendations[0];

  // 4. Personalized Career Roadmap
  const careerRoadmap: CareerRoadmapStep[] = [
    {
      stepNumber: 1,
      title: 'Current Skill Baseline',
      subtitle: `Verified: ${userSkills.join(', ')}`,
      duration: 'Immediate',
      status: 'completed',
      description: `Confirmed baseline profile for ${profile.name} (${profile.education}, ${profile.district}, ${profile.state}).`,
      iconName: 'UserCheck'
    },
    {
      stepNumber: 2,
      title: 'Skill Gap & Bridge Focus',
      subtitle: `Priority: ${skillGap.prioritySkillingArea}`,
      duration: 'Week 1',
      status: 'current',
      description: `Focus on acquiring ${skillGap.missingSkills.map(s => s.skillName).slice(0, 2).join(' & ')} to attain Level ${primaryCourse.nsqfLevel} competency.`,
      iconName: 'Sparkles'
    },
    {
      stepNumber: 3,
      title: `NSQF Training: ${primaryCourse.title}`,
      subtitle: `${primaryCourse.durationText} · ${primaryCourse.qpCode}`,
      duration: primaryCourse.durationText,
      status: 'upcoming',
      description: `Zero-cost NSQF skilling sponsored under PM-AJAY Grants-in-Aid (GIA) Component.`,
      giaBenefit: '100% Free Training + DBT Stipend under PM-AJAY GIA',
      iconName: 'GraduationCap'
    },
    {
      stepNumber: 4,
      title: 'NCVET Official Skill Certification',
      subtitle: `Certifying Body: ${primaryCourse.certifyingBody}`,
      duration: 'End of Course',
      status: 'upcoming',
      description: 'Government certified NSQF qualification recognized across India for bank loans and jobs.',
      giaBenefit: 'National Skill India Credential + NQR Verification',
      iconName: 'Award'
    },
    {
      stepNumber: 5,
      title: profile.preferredLivelihood === 'Self-employment' ? 'PM-AJAY GIA Toolkit Grant & Enterprise Launch' : 'Direct Livelihood Placement',
      subtitle: `${primaryLivelihood?.title}`,
      duration: 'Immediate Post-Skilling',
      status: 'upcoming',
      description: profile.preferredLivelihood === 'Self-employment'
        ? `Receive ${primaryLivelihood?.giaSupport || 'PM-AJAY GIA toolkit equipment grant'} to generate an estimated monthly income of ${primaryLivelihood?.incomeRange || '₹15,000–₹25,000'}.`
        : `Direct placement in ${primaryLivelihood?.title} with wage range of ${primaryLivelihood?.incomeRange}.`,
      giaBenefit: primaryLivelihood?.giaSupport || 'PM-AJAY Equipment Toolkit Grant',
      iconName: 'Briefcase'
    }
  ];

  // 5. Executive AI Summary
  const aiSummary = `Based on ${profile.name}'s profile (${profile.education}, existing skills in ${userSkills.join(', ')}), SakshamAI recommends ${primaryCourse.title} (${primaryCourse.qpCode}, NSQF Level ${primaryCourse.nsqfLevel}). Upon completion, the beneficiary qualifies for ${profile.preferredLivelihood === 'Self-employment' ? '100% PM-AJAY GIA equipment toolkit grant support' : 'direct placement'} for "${primaryLivelihood?.title}" with an expected income of ${primaryLivelihood?.incomeRange || '₹15,000–₹28,000/month'}.`;

  return {
    profile,
    skillGap,
    nsqfRecommendations: topNSQF,
    livelihoodRecommendations: topLivelihood,
    careerRoadmap,
    aiSummary
  };
}

/**
 * Natural language extraction supporting English, Hindi, Telugu, Tamil, Marathi text/voice
 */
export function extractProfileFromText(transcript: string, currentProfile?: Partial<BeneficiaryProfile>): Partial<BeneficiaryProfile> {
  const text = transcript.toLowerCase();
  const extracted: Partial<BeneficiaryProfile> = { ...currentProfile };

  // 1. Full Name Extraction (Multilingual)
  const namePatterns = [
    /(?:hey\s+|hi\s+|hello\s+)?(?:i['’]m|i\s+am|myself|this\s+is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)(?:\s+i\s+have|\s+i\s+studied|\s+and|\s+from|\s+my|,|\.|$)/i,
    /(?:my\s+name\s+is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)(?:\s+i\s+have|\s+i\s+am|\s+and|\s+from|,|\.|$)/i,
    /(?:mera\s+naam|meri\s+naam)\s+([a-zA-Z\u0900-\u097F]+(?:\s+[a-zA-Z\u0900-\u097F]+)?)(?:\s+hai|\s+aur|,|\.|$)/i,
    /(?:naa\s+peru|na\s+peru)\s+([a-zA-Z\u0C00-\u0C7F]+(?:\s+[a-zA-Z\u0C00-\u0C7F]+)?)(?:\s+andi|\s+nenu|,|\.|$)/i,
    /(?:en\s+peyar)\s+([a-zA-Z\u0B80-\u0BFF]+(?:\s+[a-zA-Z\u0B80-\u0BFF]+)?)/i,
    /(?:maaze\s+naav)\s+([a-zA-Z\u0900-\u097F]+(?:\s+[a-zA-Z\u0900-\u097F]+)?)/i
  ];

  for (const pattern of namePatterns) {
    const match = transcript.match(pattern);
    if (match && match[1]) {
      const rawName = match[1].trim();
      const invalidWords = ['looking', 'interested', 'seeking', 'working', 'living', 'from', 'pass', 'passed', 'standard', 'tenth', 'student', 'here'];
      if (!invalidWords.includes(rawName.toLowerCase()) && rawName.length >= 2) {
        extracted.name = rawName
          .split(/\s+/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        break;
      }
    }
  }

  // 2. Education Level Extraction
  if (
    text.includes('10th') || text.includes('tenth') || text.includes('10 pass') || text.includes('10th standard') ||
    text.includes('10 वीं') || text.includes('10वीं') || text.includes('10వ') || text.includes('10 ஆம்') || text.includes('10 वी')
  ) {
    extracted.education = '10th Pass';
  } else if (
    text.includes('12th') || text.includes('twelfth') || text.includes('12 pass') || text.includes('12th standard') ||
    text.includes('inter') || text.includes('intermediate') || text.includes('higher secondary') ||
    text.includes('12 वीं') || text.includes('12वीं') || text.includes('12వ') || text.includes('12 ஆம்') || text.includes('12 वी')
  ) {
    extracted.education = '12th Pass';
  } else if (
    text.includes('8th') || text.includes('eighth') || text.includes('8 pass') || text.includes('8th standard') ||
    text.includes('8 वीं') || text.includes('8वीं') || text.includes('8వ') || text.includes('8 ஆம்') || text.includes('8 वी')
  ) {
    extracted.education = '8th Pass';
  } else if (text.includes('diploma') || text.includes('iti') || text.includes('polytechnic')) {
    extracted.education = 'ITI / Diploma';
  } else if (text.includes('graduate') || text.includes('degree') || text.includes('btech') || text.includes('bsc') || text.includes('bcom') || text.includes('ba')) {
    extracted.education = 'Graduate & Above';
  } else if (text.includes('below 8th') || text.includes('5th') || text.includes('primary') || text.includes('uneducated')) {
    extracted.education = 'Below 8th';
  }

  // 3. Work Experience Extraction
  const expMatch = transcript.match(/(\d+)\s*(?:years?|yrs?)(?:\s*of)?\s*(?:work\s*)?experience/i) ||
                   transcript.match(/(?:experience\s*of\s*)(\d+)\s*(?:years?|yrs?)/i) ||
                   transcript.match(/(\d+)\s*(?:साल|saal|वर्ष)\s*(?:का\s*)?(?:अनुभव|anubhav)/i) ||
                   transcript.match(/(\d+)\s*(?:సంవత్సరాల|samvatsarala)\s*(?:అనుభవం|anubhavam)/i);
  if (expMatch && expMatch[1]) {
    extracted.workExperienceYears = parseInt(expMatch[1], 10);
  }

  // 4. Multilingual Skills Extraction & Fresh Skill Set Mapping
  const newlyDetectedSkills: string[] = [];

  if (text.includes('ms word') || text.includes('word document') || text.includes('ms-word') || text.includes('msword')) {
    newlyDetectedSkills.push('MS Word');
  }
  if (text.includes('excel') || text.includes('ms excel') || text.includes('spreadsheet') || text.includes('msexcel')) {
    newlyDetectedSkills.push('MS Excel');
  }
  if (text.includes('ms office') || text.includes('office')) {
    if (!newlyDetectedSkills.includes('MS Office')) newlyDetectedSkills.push('MS Office');
  }
  if (text.includes('typing') || text.includes('data entry') || text.includes('data typing') || text.includes('టైపింగ్')) {
    newlyDetectedSkills.push('Data Entry Typing');
  }
  if (
    (text.includes('computer') || text.includes('कंप्यूटर') || text.includes('కంప్యూటర్')) &&
    !text.includes('no basics of computer') && !text.includes('no computer')
  ) {
    if (!newlyDetectedSkills.includes('Basic Computers')) newlyDetectedSkills.push('Basic Computers');
  }
  if (text.includes('tailor') || text.includes('stitch') || text.includes('sewing') || text.includes('सिलाई') || text.includes('कुట్టు') || text.includes('தையல்')) {
    newlyDetectedSkills.push('Tailoring & Stitching');
    newlyDetectedSkills.push('Sewing Machine Operation');
  }
  if (text.includes('electric') || text.includes('wiring') || text.includes('बिजली') || text.includes('వైరింగ్') || text.includes('மின்சாரம்')) {
    newlyDetectedSkills.push('House Wiring');
    newlyDetectedSkills.push('Electrical Testing');
  }
  if (text.includes('solar') || text.includes('सोलर') || text.includes('suryamitra')) {
    newlyDetectedSkills.push('Solar Panel Installation');
  }
  if (text.includes('mobile') || text.includes('phone') || text.includes('మోబైల్') || text.includes('ఫోన్')) {
    newlyDetectedSkills.push('Mobile Phone Hardware Repair');
  }
  if (text.includes('patient') || text.includes('hospital') || text.includes('nurse') || text.includes('gda') || text.includes('ward')) {
    newlyDetectedSkills.push('Patient Care (GDA)');
    newlyDetectedSkills.push('Vital Signs Monitoring');
  }
  if (text.includes('poultry') || text.includes('chicken') || text.includes('मुर्गी') || text.includes('కోళ్ళ')) {
    newlyDetectedSkills.push('Backyard Poultry Farming');
  }
  if (text.includes('farm') || text.includes('agriculture') || text.includes('खेती') || text.includes('వ్యవసాయం') || text.includes('విவசாயம்')) {
    newlyDetectedSkills.push('Organic Farming');
  }
  if (text.includes('mechanic') || text.includes('two wheeler') || text.includes('bike') || text.includes('मैकेनिक') || text.includes('మెకానిక్')) {
    newlyDetectedSkills.push('Two-Wheeler Mechanic');
  }
  if (text.includes('beauty') || text.includes('makeup') || text.includes('parlour') || text.includes('salon') || text.includes('ब्यूटी')) {
    newlyDetectedSkills.push('Beauty Parlour & Makeup');
  }
  if (text.includes('plumb') || text.includes('pipe') || text.includes('नल') || text.includes('ప్లంబర్')) {
    newlyDetectedSkills.push('Plumbing & Pipe Fitting');
  }

  // When speech mentions specific skills, replace default placeholder demo skills
  if (newlyDetectedSkills.length > 0) {
    extracted.existingSkills = newlyDetectedSkills;
  }

  // 5. Preferred Livelihood, Occupation & Goal Extraction
  if (
    text.includes('job') || text.includes('looking for a job') || text.includes('want a job') || text.includes('seeking a job') ||
    text.includes('company') || text.includes('salary') || text.includes('नौकरी') || text.includes('ఉద్యోగం') || text.includes('வேலை')
  ) {
    extracted.preferredLivelihood = 'Job';

    if (newlyDetectedSkills.some(s => s.includes('Word') || s.includes('Excel') || s.includes('Office') || s.includes('Data Entry') || s.includes('Computer'))) {
      extracted.currentOccupation = 'Data Entry Operator / Office Assistant';
      extracted.careerGoal = `Secure a certified job as Domestic Data Entry Operator (DEO) with ${newlyDetectedSkills.join(' & ')} proficiency.`;
      extracted.interests = ['Office Automation', 'Data Digitization'];
    } else if (newlyDetectedSkills.some(s => s.includes('Patient'))) {
      extracted.currentOccupation = 'Healthcare General Duty Assistant';
      extracted.careerGoal = 'Secure a salaried General Duty Assistant job in a district hospital.';
      extracted.interests = ['Hospital Nursing Support', 'Patient Care'];
    } else if (newlyDetectedSkills.some(s => s.includes('Solar'))) {
      extracted.currentOccupation = 'Solar Array Installation Assistant';
      extracted.careerGoal = 'Secure employment in a commercial solar power plant with NSQF Suryamitra certification.';
      extracted.interests = ['Renewable Energy', 'Solar Maintenance'];
    }
  } else if (
    text.includes('self') || text.includes('business') || text.includes('own shop') || text.includes('toolkit') ||
    text.includes('दुकान') || text.includes('स्वरोजगार') || text.includes('స్వయం ఉపాధి') || text.includes('சுயதொழில்')
  ) {
    extracted.preferredLivelihood = 'Self-employment';

    if (newlyDetectedSkills.some(s => s.includes('Tailor'))) {
      extracted.currentOccupation = 'Custom Tailoring & Stitching';
      extracted.careerGoal = 'Establish a home-based garment stitching unit with PM-AJAY motorized sewing machine toolkit grant.';
      extracted.interests = ['Garment Construction', 'Boutique Setup'];
    } else if (newlyDetectedSkills.some(s => s.includes('Solar'))) {
      extracted.currentOccupation = 'Solar Rooftop Installation Technician';
      extracted.careerGoal = 'Establish a local solar installation agency with PM-AJAY GIA toolset grant.';
      extracted.interests = ['PM-Surya Ghar Scheme', 'Inverter Servicing'];
    } else if (newlyDetectedSkills.some(s => s.includes('Poultry'))) {
      extracted.currentOccupation = 'Poultry Farming Unit';
      extracted.careerGoal = 'Scale up backyard organic poultry unit with PM-AJAY chick and feed GIA grant.';
      extracted.interests = ['Free-range Poultry', 'Bio-Composting'];
    }
  } else if (text.includes('fpo') || text.includes('startup') || text.includes('enterprise') || text.includes('collective')) {
    extracted.preferredLivelihood = 'Entrepreneurship';
  } else if (text.includes('training') || text.includes('learn') || text.includes('course') || text.includes('प्रशिक्षण') || text.includes('శిక్షణ')) {
    extracted.preferredLivelihood = 'Skill training';
  }

  return extracted;
}


