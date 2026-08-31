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
 * Comprehensive Multilingual Natural Language Extraction
 * Supporting English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिंदी), and Marathi (मराठी)
 */
export function extractProfileFromText(transcript: string, currentProfile?: Partial<BeneficiaryProfile>): Partial<BeneficiaryProfile> {
  const text = transcript.toLowerCase().trim();
  const extracted: Partial<BeneficiaryProfile> = { ...currentProfile };

  // 1. Full Name & Age Extraction (Multilingual)
  const stopWords = [
    'looking', 'interested', 'seeking', 'working', 'living', 'from', 'pass', 'passed', 'standard', 'tenth', 'student', 'here',
    'நான்', 'தமிழ்நாடு', 'ஸ்டேட்லேருந்து', 'டிஸ்ட்ரிக்ட்', 'இருந்து', 'வந்து', 'தெரியும்', 'வேலை', 'மாதச்', 'சம்பள',
    'నేను', 'నుండి', 'మరియు', 'తెలుసు', 'ఉద్యోగం', 'జాబ్',
    'है', 'हूँ', 'का', 'की', 'से', 'और', 'रहता', 'काम', 'नौकरी',
    'आहे', 'मी', 'आणि', 'राहतो', 'नोकरी',
    'job', 'self', 'employment', 'business', 'training', 'plumbing', 'tailoring', 'electrical', 'farming'
  ];

  // Direct Format Match: e.g. "Yashwant, 24, age old" or "Yashwant 24" or "Yashwant, 24"
  const directNameAgeMatch = transcript.match(/^([a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+(?:\s+[a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]+)?)\s*[,|\s]+\s*(\d{1,2})(?:\s*[,|\s]|\.|$)/i);
  if (directNameAgeMatch && directNameAgeMatch[1]) {
    const candidateName = directNameAgeMatch[1].trim().replace(/[(),.]/g, '');
    const candidateAge = parseInt(directNameAgeMatch[2], 10);

    if (!stopWords.includes(candidateName.toLowerCase()) && candidateName.length >= 2 && !/^\d+$/.test(candidateName)) {
      if (/^[a-zA-Z\s]+$/.test(candidateName)) {
        extracted.name = candidateName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      } else {
        extracted.name = candidateName;
      }
    }
    if (candidateAge >= 15 && candidateAge <= 65) {
      extracted.age = candidateAge;
    }
  }

  // If name not yet extracted, check patterns
  if (!extracted.name) {
    const namePatterns = [
      // Tamil: என் பேரு யஷ்வந்த் / என் பெயர் யஷ்வந்த்
      /(?:என்\s*பேரு|என்\s*பெயர்|என்\s*பேர்|என்\s*பெயரு)\s+([^\s,.\n()]+(?:\s+[^\s,.\n()]+)?)/i,
      // Telugu: నా పేరు అఖిల్
      /(?:నా\s*పేరు|నా\s*పేరు\s*వచ్చి)\s+([^\s,.\n()]+(?:\s+[^\s,.\n()]+)?)/i,
      // Hindi: मेरा नाम राहुल कुमार / मेरी नाम
      /(?:मेरा\s*नाम|मेरी\s*नाम)\s+([^\s,.\n()]+(?:\s+[^\s,.\n()]+)?)/i,
      // Marathi: माझे नाव सचिन / माझं नाव
      /(?:माझे\s*नाव|माझं\s*नाव)\s+([^\s,.\n()]+(?:\s+[^\s,.\n()]+)?)/i,
      // English: Hey I'm Akhil Rojana / My name is Akhil
      /(?:hey\s+|hi\s+|hello\s+)?(?:i['’]m|i\s+am|myself|this\s+is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)(?:\s+i\s+have|\s+i\s+studied|\s+and|\s+from|\s+my|,|\.|$)/i,
      /(?:my\s+name\s+is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)(?:\s+i\s+have|\s+i\s+am|\s+and|\s+from|,|\.|$)/i,
      // Single standalone name input
      /^([a-zA-Z\u0900-\u097F\u0B80-\u0BFF\u0C00-\u0C7F]{2,25})$/i
    ];

    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match && match[1]) {
        let rawName = match[1].trim().replace(/[()]/g, '');

        // Split into words and strip trailing stop words
        const words = rawName.split(/\s+/).filter(w => !stopWords.includes(w.toLowerCase()));
        if (words.length > 0) {
          rawName = words.join(' ');
          if (!stopWords.includes(rawName.toLowerCase()) && rawName.length >= 2 && !/^\d+$/.test(rawName)) {
            if (/^[a-zA-Z\s]+$/.test(rawName)) {
              extracted.name = rawName
                .split(/\s+/)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');
            } else {
              extracted.name = rawName;
            }
            break;
          }
        }
      }
    }
  }

  // 2. Age Extraction (Multilingual)
  if (!extracted.age) {
    const ageMatch =
      transcript.match(/(?:age\s*(?:is)?\s*|வயது\s*|வயசு\s*|వయస్సు\s*|ఉम्र\s*|वय\s*)(\d{1,2})/i) ||
      transcript.match(/(\d{1,2})\s*(?:years\s*old|yrs\s*old|age\s*old|years|yrs|வயது|வயசு|సంవత్సరాల\s*వయస్సు|साल\s*की\s*उम्र|वर्षे\s*वय)/i) ||
      transcript.match(/(?:,\s*|\s+)(\d{1,2})(?:\s*,\s*|\s+age|\s+years|\.|$)/i);
    if (ageMatch && ageMatch[1]) {
      const parsedAge = parseInt(ageMatch[1], 10);
      if (parsedAge >= 15 && parsedAge <= 65) {
        extracted.age = parsedAge;
      }
    }
  }

  // 3. State & District Extraction (Multilingual)
  // State Detection
  if (text.includes('tamil nadu') || text.includes('tamilnadu') || text.includes('தமிழ்நாடு') || text.includes('தமிழ் நாடு') || text.includes('தமிழ்நாட்டிலிருந்து')) {
    extracted.state = 'Tamil Nadu';
  } else if (text.includes('andhra pradesh') || text.includes('andhra') || text.includes('ఆంధ్రప్రదేశ్') || text.includes('ఆంధ్ర')) {
    extracted.state = 'Andhra Pradesh';
  } else if (text.includes('telangana') || text.includes('తెలంగాణ') || text.includes('తెలంగాణ నుండి')) {
    extracted.state = 'Telangana';
  } else if (text.includes('uttar pradesh') || text.includes('up') || text.includes('उत्तर प्रदेश') || text.includes('यूपी')) {
    extracted.state = 'Uttar Pradesh';
  } else if (text.includes('bihar') || text.includes('बिहार')) {
    extracted.state = 'Bihar';
  } else if (text.includes('maharashtra') || text.includes('महाराष्ट्र')) {
    extracted.state = 'Maharashtra';
  } else if (text.includes('punjab') || text.includes('पंजाब')) {
    extracted.state = 'Punjab';
  } else if (text.includes('rajasthan') || text.includes('राजस्थान')) {
    extracted.state = 'Rajasthan';
  }

  // District Detection (Tamil, Telugu, Hindi, Marathi, English)
  const districtMap: Record<string, string> = {
    // Tamil Nadu Districts
    'தேனி': 'Theni',
    'theni': 'Theni',
    'மதுரை': 'Madurai',
    'madurai': 'Madurai',
    'சென்னை': 'Chennai',
    'chennai': 'Chennai',
    'கோயம்புத்தூர்': 'Coimbatore',
    'கோவை': 'Coimbatore',
    'coimbatore': 'Coimbatore',
    'திருச்சி': 'Tiruchirappalli',
    'trichy': 'Tiruchirappalli',
    'சேலம்': 'Salem',
    'salem': 'Salem',
    'திண்டுக்கல்': 'Dindigul',
    'dindigul': 'Dindigul',
    'திருப்பூர்': 'Tiruppur',
    'tiruppur': 'Tiruppur',
    'தஞ்சாவூர்': 'Thanjavur',
    'thanjavur': 'Thanjavur',
    'திருநெல்வேலி': 'Tirunelveli',
    'tirunelveli': 'Tirunelveli',
    'வேலூர்': 'Vellore',
    'vellore': 'Vellore',
    'விழுப்புரம்': 'Villupuram',
    'ஈரோடு': 'Erode',
    'கடலூர்': 'Cuddalore',
    'கன்னியாகுமரி': 'Kanyakumari',

    // Andhra Pradesh & Telangana Districts
    'విజయనగరం': 'Vizianagaram',
    'vizianagaram': 'Vizianagaram',
    'విశాఖపట్నం': 'Visakhapatnam',
    'వైజాగ్': 'Visakhapatnam',
    'visakhapatnam': 'Visakhapatnam',
    'గుంటూరు': 'Guntur',
    'guntur': 'Guntur',
    'కృష్ణా': 'Krishna',
    'విజయవాడ': 'Krishna',
    'vijayawada': 'Krishna',
    'కర్నూలు': 'Kurnool',
    'kurnool': 'Kurnool',
    'అనంతపురం': 'Anantapur',
    'anantapur': 'Anantapur',
    'వరంగల్': 'Warangal',
    'warangal': 'Warangal',
    'హైదరాబాద్': 'Hyderabad',
    'hyderabad': 'Hyderabad',
    'కరీంనగర్': 'Karimnagar',
    'ఖమ్మం': 'Khammam',

    // Uttar Pradesh & Bihar Districts
    'वाराणसी': 'Varanasi',
    'बनारस': 'Varanasi',
    'varanasi': 'Varanasi',
    'सीतापुर': 'Sitapur',
    'sitapur': 'Sitapur',
    'गया': 'Gaya',
    'gaya': 'Gaya',
    'पटना': 'Patna',
    'patna': 'Patna',
    'लखनऊ': 'Lucknow',
    'lucknow': 'Lucknow',
    'गोरखपुर': 'Gorakhpur',
    'कानपुर': 'Kanpur',
    'प्रयागराज': 'Prayagraj',
    'इलाहाबाद': 'Prayagraj',
    'आगरा': 'Agra',

    // Maharashtra Districts
    'सोलापूर': 'Solapur',
    'solapur': 'Solapur',
    'पुणे': 'Pune',
    'pune': 'Pune',
    'मुंबई': 'Mumbai',
    'mumbai': 'Mumbai',
    'नागपूर': 'Nagpur',
    'nagpur': 'Nagpur',
    'नाशिक': 'Nashik',
    'nashik': 'Nashik',
    'कोल्हापूर': 'Kolhapur'
  };

  for (const [kw, districtName] of Object.entries(districtMap)) {
    if (text.includes(kw)) {
      extracted.district = districtName;
      if (!extracted.state) {
        if (['Theni', 'Madurai', 'Chennai', 'Coimbatore', 'Tiruchirappalli', 'Salem', 'Dindigul', 'Tiruppur', 'Thanjavur', 'Tirunelveli', 'Vellore'].includes(districtName)) {
          extracted.state = 'Tamil Nadu';
        } else if (['Vizianagaram', 'Visakhapatnam', 'Guntur', 'Krishna', 'Kurnool', 'Anantapur'].includes(districtName)) {
          extracted.state = 'Andhra Pradesh';
        } else if (['Warangal', 'Hyderabad', 'Karimnagar', 'Khammam'].includes(districtName)) {
          extracted.state = 'Telangana';
        } else if (['Varanasi', 'Sitapur', 'Lucknow', 'Gorakhpur', 'Kanpur', 'Prayagraj', 'Agra'].includes(districtName)) {
          extracted.state = 'Uttar Pradesh';
        } else if (['Gaya', 'Patna'].includes(districtName)) {
          extracted.state = 'Bihar';
        } else if (['Solapur', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Kolhapur'].includes(districtName)) {
          extracted.state = 'Maharashtra';
        }
      }
      break;
    }
  }

  // 4. Education Level Extraction (Multilingual)
  if (
    text.includes('10th') || text.includes('tenth') || text.includes('10 pass') || text.includes('10th standard') ||
    text.includes('10வது') || text.includes('10-வது') || text.includes('பத்தாம் வகுப்பு') || text.includes('பத்தாவது') || text.includes('10 ஆம்') ||
    text.includes('10వ తరగతి') || text.includes('10వ') || text.includes('టెన్త్') ||
    text.includes('10वीं') || text.includes('10 वीं') || text.includes('दसवीं') ||
    text.includes('10वी') || text.includes('दहावी')
  ) {
    extracted.education = '10th Pass';
  } else if (
    text.includes('12th') || text.includes('twelfth') || text.includes('12 pass') || text.includes('12th standard') ||
    text.includes('12வது') || text.includes('12-வது') || text.includes('பன்னிரண்டாம் வகுப்பு') || text.includes('+2') || text.includes('பிளஸ் 2') ||
    text.includes('12వ తరగతి') || text.includes('ఇంటర్') || text.includes('ఇంటర్మీడియట్') || text.includes('12వ') ||
    text.includes('12वीं') || text.includes('12 वीं') || text.includes('बारहवीं') || text.includes('इंटर') ||
    text.includes('12वी') || text.includes('बारावी')
  ) {
    extracted.education = '12th Pass';
  } else if (
    text.includes('8th') || text.includes('eighth') || text.includes('8 pass') || text.includes('8th standard') ||
    text.includes('8வது') || text.includes('8-வது') || text.includes('எட்டாம் வகுப்பு') || text.includes('எட்டாவது') ||
    text.includes('8వ తరగతి') || text.includes('8వ') ||
    text.includes('8वीं') || text.includes('8 वीं') || text.includes('आठवीं') ||
    text.includes('8वी') || text.includes('आठवी')
  ) {
    extracted.education = '8th Pass';
  } else if (
    text.includes('diploma') || text.includes('iti') || text.includes('polytechnic') ||
    text.includes('ஐடிஐ') || text.includes('டிப்ளமோ') || text.includes('ஐ.டி.ஐ') ||
    text.includes('ఐటీఐ') || text.includes('డిప్లొమా') ||
    text.includes('आईटीआई') || text.includes('डिप्लोमा') ||
    text.includes('आयटीआय')
  ) {
    extracted.education = 'ITI / Diploma';
  } else if (
    text.includes('graduate') || text.includes('degree') || text.includes('btech') || text.includes('bsc') || text.includes('bcom') || text.includes('ba') ||
    text.includes('பட்டப்படிப்பு') || text.includes('டிகிரி') || text.includes('கிராஜுவேட்') ||
    text.includes('డిగ్రీ') || text.includes('గ్రాడ్యుయేట్') || text.includes('బీటెక్') ||
    text.includes('ग्रेजुएट') || text.includes('डिग्री') || text.includes('स्नातक') ||
    text.includes('पदवी') || text.includes('पदवीधर')
  ) {
    extracted.education = 'Graduate & Above';
  } else if (
    text.includes('below 8th') || text.includes('5th') || text.includes('primary') || text.includes('uneducated') ||
    text.includes('படிப்பு இல்லை') || text.includes('5வது') || text.includes('చదువుకోలేదు') || text.includes('5వ') ||
    text.includes('अनपढ़') || text.includes('5वीं')
  ) {
    extracted.education = 'Below 8th';
  }

  // 5. Work Experience Extraction (Multilingual Numbers & Words)
  let expYears: number | null = null;

  // Check Tamil words: டூ இயர்ஸ் (2), ஒன் இயர் (1), திரீ இயர்ஸ் (3), போர் இயர்ஸ் (4), 5 இயர்ஸ்
  if (text.includes('டூ இயர்ஸ்') || text.includes('டூ இயர்') || text.includes('ரெண்டு வருஷம்') || text.includes('2 வருடம்') || text.includes('2 இயர்ஸ்') || text.includes('2 வருட')) {
    expYears = 2;
  } else if (text.includes('ஒன் இயர்') || text.includes('ஒரு வருடம்') || text.includes('1 வருடம்') || text.includes('1 இயர்')) {
    expYears = 1;
  } else if (text.includes('திரீ இயர்ஸ்') || text.includes('மூன்று வருடம்') || text.includes('3 வருடம்') || text.includes('3 இயர்ஸ்')) {
    expYears = 3;
  } else if (text.includes('போர் இயர்ஸ்') || text.includes('நான்கு வருடம்') || text.includes('4 வருடம்') || text.includes('4 இயர்ஸ்')) {
    expYears = 4;
  } else if (text.includes('பைவ் இயர்ஸ்') || text.includes('ஐந்து வருடம்') || text.includes('5 வருடம்') || text.includes('5 இயர்ஸ்')) {
    expYears = 5;
  }

  // Check Telugu words
  if (!expYears) {
    if (text.includes('రెండు సంవత్సరాల') || text.includes('2 సంవత్సరాల') || text.includes('2 ఇయర్స్')) {
      expYears = 2;
    } else if (text.includes('ఒక సంవత్సరం') || text.includes('1 సంవత్సరం') || text.includes('1 ఇయర్')) {
      expYears = 1;
    } else if (text.includes('మూడు సంవత్సరాల') || text.includes('3 సంవత్సరాల') || text.includes('3 ఇయర్స్')) {
      expYears = 3;
    } else if (text.includes('నాలుగు సంవత్సరాల') || text.includes('4 సంవత్సరాల')) {
      expYears = 4;
    } else if (text.includes('ఐదు సంవత్సరాల') || text.includes('5 సంవత్సరాల')) {
      expYears = 5;
    }
  }

  // Check Hindi & Marathi words
  if (!expYears) {
    if (text.includes('दो साल') || text.includes('2 साल') || text.includes('दोन वर्षे') || text.includes('2 वर्षे')) {
      expYears = 2;
    } else if (text.includes('एक साल') || text.includes('1 साल') || text.includes('एक वर्ष') || text.includes('1 वर्ष')) {
      expYears = 1;
    } else if (text.includes('तीन साल') || text.includes('3 साल') || text.includes('तीन वर्षे') || text.includes('3 वर्षे')) {
      expYears = 3;
    } else if (text.includes('चार साल') || text.includes('4 साल') || text.includes('चार वर्षे')) {
      expYears = 4;
    } else if (text.includes('पांच साल') || text.includes('5 साल') || text.includes('पाच वर्षे')) {
      expYears = 5;
    }
  }

  // Regex fallback
  if (!expYears) {
    const expMatch =
      transcript.match(/(\d+)\s*(?:years?|yrs?|இயர்ஸ்|வருட|வருஷம்|సంవత్సరాల|साल|वर्षे)/i) ||
      transcript.match(/(?:experience\s*of\s*|அனுபவம்\s*|అనుభవం\s*|अनुभव\s*)(\d+)/i);
    if (expMatch && expMatch[1]) {
      expYears = parseInt(expMatch[1], 10);
    }
  }

  if (expYears !== null && expYears >= 0 && expYears <= 40) {
    extracted.workExperienceYears = expYears;
  }

  // 6. Multilingual Skills Extraction
  const newlyDetectedSkills: string[] = [];

  // Plumbing
  if (
    text.includes('ப்ளம்பிங்') || text.includes('பிளம்பிங்') || text.includes('குழாய் வேலை') ||
    text.includes('ప్లంబింగ్') || text.includes('నల్లా పని') ||
    text.includes('प्लंबिंग') || text.includes('नल फिटिंग') || text.includes('प्लंबर') ||
    text.includes('plumbing') || text.includes('plumber')
  ) {
    newlyDetectedSkills.push('Plumbing & Pipe Fitting');
  }

  // Tailoring & Stitching
  if (
    text.includes('தையல்') || text.includes('டைலரிங்') || text.includes('துணி தைப்பது') || text.includes('ஆடை வடிவமைப்பு') ||
    text.includes('కుట్టుపని') || text.includes('టైలరింగ్') || text.includes('కుట్టు') ||
    text.includes('सिलाई') || text.includes('कटाई') || text.includes('टेलरिंग') || text.includes('दर्जी') ||
    text.includes('शिवणकाम') || text.includes('टेलरिंग') ||
    text.includes('tailor') || text.includes('stitch') || text.includes('sewing')
  ) {
    newlyDetectedSkills.push('Tailoring & Garment Stitching');
    newlyDetectedSkills.push('Sewing Machine Operation');
  }

  // Electrical & House Wiring
  if (
    text.includes('எலக்ட்ரீசியன்') || text.includes('வயரிங்') || text.includes('மின்சார வேலை') || text.includes('மின்சாரம்') ||
    text.includes('ఎలక్ట్రీషియన్') || text.includes('వైరింగ్') || text.includes('కరెంట్ పని') ||
    text.includes('इलेक्ट्रीशियन') || text.includes('बिजली वायरिंग') || text.includes('बिजली का काम') ||
    text.includes('वायरिंग') || text.includes('इलेक्ट्रिकल') ||
    text.includes('electric') || text.includes('wiring')
  ) {
    newlyDetectedSkills.push('House Wiring & Electricals');
    newlyDetectedSkills.push('Electrical Testing');
  }

  // Solar Rooftop Installation
  if (
    text.includes('சோலார்') || text.includes('சூரிய சக்தி') || text.includes('சூரிய ஒளி') ||
    text.includes('సోలార్') || text.includes('సూర్యమిత్ర') || text.includes('సౌర విద్యుత్') ||
    text.includes('सोलर') || text.includes('सूर्यमित्र') || text.includes('सोलर पैनल') ||
    text.includes('solar') || text.includes('suryamitra')
  ) {
    newlyDetectedSkills.push('Solar Panel Installation');
  }

  // Mobile Hardware Repair
  if (
    text.includes('மொபைல் சர்வீஸ்') || text.includes('செல்போன் ரிப்பேர்') || text.includes('மொபைல் ரிப்பேர்') ||
    text.includes('మొబైల్ రిపేరింగ్') || text.includes('ఫోన్ సర్వీసింగ్') ||
    text.includes('मोबाइल रिपेयरिंग') || text.includes('फोन सुधारना') ||
    text.includes('मोबाईल रिपेअरिंग') ||
    text.includes('mobile repair') || text.includes('phone hardware')
  ) {
    newlyDetectedSkills.push('Mobile Phone Hardware Repair');
  }

  // Computers & Data Entry & MS Office
  if (text.includes('ms word') || text.includes('எம்எஸ் வேர்ட்') || text.includes('वर्ड')) {
    newlyDetectedSkills.push('MS Word');
  }
  if (text.includes('excel') || text.includes('ms excel') || text.includes('எக்செல்') || text.includes('ఎక్సెల్') || text.includes('एक्सेल')) {
    newlyDetectedSkills.push('MS Excel');
  }
  if (
    text.includes('typing') || text.includes('data entry') ||
    text.includes('தட்டச்சு') || text.includes('டைப்பிங்') || text.includes('டேட்டா என்ட்ரி') ||
    text.includes('టైపింగ్') || text.includes('డేటా ఎంట్రీ') ||
    text.includes('टाइपिंग') || text.includes('डाटा एंट्री')
  ) {
    newlyDetectedSkills.push('Data Entry Typing');
  }
  if (
    (text.includes('computer') || text.includes('கம்ப்யூட்டர்') || text.includes('கணினி') || text.includes('కంప్యూటర్') || text.includes('कंप्यूटर') || text.includes('संगणक')) &&
    !text.includes('no basics of computer') && !text.includes('படிப்பு இல்லை')
  ) {
    if (!newlyDetectedSkills.includes('Basic Computers')) newlyDetectedSkills.push('Basic Computers');
  }

  // Healthcare / GDA
  if (
    text.includes('நர்சிங்') || text.includes('மருத்துவமனை வேலை') || text.includes('நோயாளி பராமரிப்பு') ||
    text.includes('నర్సింగ్') || text.includes('ఆసుపత్రి పని') || text.includes('రోగుల సంరక్షణ') ||
    text.includes('नर्सिंग') || text.includes('अस्पताल सहायक') || text.includes('रोगी देखभाल') ||
    text.includes('patient care') || text.includes('nurse') || text.includes('hospital') || text.includes('gda')
  ) {
    newlyDetectedSkills.push('Patient Care (GDA)');
    newlyDetectedSkills.push('Vital Signs Monitoring');
  }

  // Poultry & Farming
  if (
    text.includes('கோழி பண்ணை') || text.includes('நாட்டு கோழி') || text.includes('கோழி வளர்ப்பு') ||
    text.includes('కోళ్ళ పెంపకం') || text.includes('నాటు కోళ్ళు') ||
    text.includes('मुर्गी पालन') || text.includes('पोल्ट्री') ||
    text.includes('कुक्कुटपालन') ||
    text.includes('poultry') || text.includes('chicken farming')
  ) {
    newlyDetectedSkills.push('Backyard Poultry Farming');
  }
  if (
    text.includes('விவசாயம்') || text.includes('இயற்கை விவசாயம்') ||
    text.includes('వ్యవసాయం') || text.includes('సేంద్రీయ వ్యవసాయం') ||
    text.includes('खेती') || text.includes('जैविक खेती') ||
    text.includes('शेती') || text.includes('सेंद्रिय शेती') ||
    text.includes('organic farming') || text.includes('agriculture')
  ) {
    newlyDetectedSkills.push('Organic Farming');
  }

  // Two-Wheeler Repair
  if (
    text.includes('டூ வீலர் மெக்கானிக்') || text.includes('பைக் சர்வீஸ்') || text.includes('இருசக்கர வாகனம்') ||
    text.includes('టూ వీలర్ మెకానిక్') || text.includes('బైక్ రిపేర్') ||
    text.includes('टू-व्हीलर मैकेनिक') || text.includes('बाइक रिपेयर') ||
    text.includes('दुचाकी मेकॅनिक') ||
    text.includes('two wheeler') || text.includes('bike mechanic')
  ) {
    newlyDetectedSkills.push('Two-Wheeler Mechanic');
  }

  // Beauty Parlour
  if (
    text.includes('பியூட்டி பார்லர்') || text.includes('மேக்கப்') || text.includes('மணப்பெண் அலங்காரம்') ||
    text.includes('బ్యూటీ పార్లర్') || text.includes('మేకప్') ||
    text.includes('ब्यूटी पार्लर') || text.includes('मेकअप') ||
    text.includes('ब्युटी पार्लर') ||
    text.includes('beauty parlour') || text.includes('bridal makeup')
  ) {
    newlyDetectedSkills.push('Beauty Parlour & Makeup');
  }

  // Update existing skills if detected
  if (newlyDetectedSkills.length > 0) {
    extracted.existingSkills = newlyDetectedSkills;
  }

  // 7. Preferred Livelihood & Career Goal Extraction (Multilingual)
  if (
    text.includes('job') || text.includes('ஜாப்') || text.includes('வேலை') || text.includes('சம்பள வேலை') ||
    text.includes('ఉద్యోగం') || text.includes('జాబ్') || text.includes('నౌకరీ') ||
    text.includes('नौकरी') || text.includes('जॉब') || text.includes('वेतन') ||
    text.includes('नोकरी') || text.includes('कामावर')
  ) {
    extracted.preferredLivelihood = 'Job';

    if (newlyDetectedSkills.some(s => s.includes('Plumbing'))) {
      extracted.currentOccupation = 'Plumber Technician';
      extracted.careerGoal = 'Secure a certified plumbing technician job in commercial construction or facility management.';
      extracted.interests = ['Plumbing Systems', 'Sanitary Installations'];
    } else if (newlyDetectedSkills.some(s => s.includes('Word') || s.includes('Excel') || s.includes('Data Entry') || s.includes('Computers'))) {
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
    } else if (newlyDetectedSkills.some(s => s.includes('Two-Wheeler'))) {
      extracted.currentOccupation = 'Automotive Service Assistant';
      extracted.careerGoal = 'Secure a salaried mechanic job in an authorized two-wheeler dealership service center.';
    }
  } else if (
    text.includes('self') || text.includes('business') || text.includes('own shop') || text.includes('toolkit') ||
    text.includes('சுயதொழில்') || text.includes('சொந்த தொழில்') || text.includes('டூல்கிட்') || text.includes('மானியம்') ||
    text.includes('స్వయం ఉపాధి') || text.includes('సొంత వ్యాపారం') || text.includes('టూల్‌కిట్') ||
    text.includes('स्वरोजगार') || text.includes('अपनी दुकान') || text.includes('टूलकिट') ||
    text.includes('स्वयंरोजगार') || text.includes('स्वतःचा व्यवसाय')
  ) {
    extracted.preferredLivelihood = 'Self-employment';

    if (newlyDetectedSkills.some(s => s.includes('Plumbing'))) {
      extracted.currentOccupation = 'Independent Plumbing Service';
      extracted.careerGoal = 'Establish an independent plumbing service enterprise with PM-AJAY plumbing toolkit grant.';
      extracted.interests = ['Sanitary Contracting', 'Plumbing Enterprise'];
    } else if (newlyDetectedSkills.some(s => s.includes('Tailor'))) {
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



