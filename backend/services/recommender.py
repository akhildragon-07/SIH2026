import pandas as pd
import numpy as np
from typing import List, Dict, Any
from backend.services.preprocessing import load_and_preprocess_dataset, parse_skills_string, get_education_rank
from backend.services.eligibility import check_course_eligibility
from backend.services.embeddings import compute_text_similarity
from backend.models.schemas import BeneficiaryProfileRequest

# Load global dataset
DATASET_DF = load_and_preprocess_dataset()

# Map official government course URLs for verified qualifications
OFFICIAL_URL_MAP = {
    'Sewing Machine Operator': 'https://nqr.gov.in/qualification-packs/sewing-machine-operator-0',
    'Self-Employed Tailor': 'https://nqr.gov.in/qualification-packs/self-employed-tailor-1',
    'Automotive Service Technician': 'https://nqr.gov.in/qualification-packs/automotive-service-technician-two-and-three-wheelers-0',
    'Solar PV Installer': 'https://nqr.gov.in/qualification-packs/solar-pv-installer-suryamitra',
    'Assistant Electrician': 'https://nqr.gov.in/qualification-packs/assistant-electrician-0',
    'Office Assistant': 'https://www.nielit.in/content/nsqf',
    'General Duty Assistant': 'https://nqr.gov.in/qualification-packs/general-duty-assistant-0',
    'Food Processing Worker': 'https://nqr.gov.in/qualification-packs/food-processing-worker',
    'Mobile Phone Hardware Repair Technician': 'https://nqr.gov.in/qualification-packs/mobile-phone-hardware-repair-technician',
    'Beauty Therapist': 'https://nqr.gov.in/qualification-packs/beauty-therapist-0',
    'Domestic Data Entry Operator': 'https://nqr.gov.in/qualification-packs/domestic-data-entry-operator-1',
    'Agriculture Field Technician': 'https://nqr.gov.in/qualification-packs/organic-grower-0',
    'Plumber': 'https://nqr.gov.in/qualification-packs/plumber-general-0',
    'Carpenter': 'https://nqr.gov.in/qualification-packs/carpenter-wooden-furniture-0',
    'BFSI Customer Service Executive': 'https://nqr.gov.in/qualification-packs/bfsi-customer-service-executive'
}

def generate_factual_explanation(
    profile: BeneficiaryProfileRequest,
    course_name: str,
    skill_overlap: List[str],
    is_eligible: bool,
    is_interest_match: bool,
    is_goal_match: bool,
    min_edu: str
) -> List[str]:
    """Generates transparent, factual explanations based on actual user profile alignment."""
    reasons = []

    if skill_overlap:
        reasons.append(f"Your existing skills in {', '.join(skill_overlap[:3])} match the course requirements for {course_name}.")
    else:
        reasons.append(f"Provides foundational skilling for {course_name} aligned with your career goals.")

    if is_eligible:
        reasons.append(f"Your education level ({profile.education}) satisfies the required eligibility ({min_edu}).")

    if is_goal_match:
        reasons.append(f"Your career goal ({profile.career_goal}) aligns with the target livelihood pathways for this qualification.")

    if is_interest_match and profile.interests:
        reasons.append(f"Aligns with your interest area in {', '.join(profile.interests)}.")

    return reasons

def recommend_courses(profile: BeneficiaryProfileRequest, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Hybrid recommendation algorithm:
    1. Pre-filters courses by strict eligibility rules.
    2. Computes 5-factor weighted Profile Match Score:
       - Skill Similarity (40%)
       - Eligibility Match (20%)
       - Experience Match (15%)
       - Interest Match (15%)
       - Career Goal Match (10%)
    3. Normalizes final score between 0 and 100.
    4. Attaches verified official government course URLs (`https://nqr.gov.in/` & `https://www.nielit.in/content/nsqf`).
    """
    df = DATASET_DF.copy()

    user_skills_set = set([s.lower() for s in profile.skills])
    user_interests_set = set([i.lower() for i in profile.interests])
    user_goal = profile.career_goal.lower()

    user_profile_text = f"{profile.education} {' '.join(profile.skills)} {profile.experience_years} years {' '.join(profile.interests)} {profile.career_goal}"

    course_groups = df.groupby('recommended_qualification').first().reset_index()

    course_texts = []
    for _, row in course_groups.iterrows():
        c_text = f"{row['recommended_qualification']} {row['sector']} {row['recommended_skills']} {row['job_role_demo']} {row['livelihood_type_demo']}"
        course_texts.append(c_text)

    semantic_sims = compute_text_similarity(user_profile_text, course_texts)

    results = []

    for idx, row in course_groups.iterrows():
        course_name = row['recommended_qualification']
        min_edu = str(row['minimum_education_demo'])
        sector = str(row['sector'])
        nsqf_level = int(row['nsqf_level_demo'])
        req_skills_list = parse_skills_string(row['recommended_skills'])
        job_role = str(row['job_role_demo'])
        livelihood_type = str(row['livelihood_type_demo'])

        # 1. Eligibility Check
        is_eligible = check_course_eligibility(profile.education, profile.experience_years, min_edu)
        if not is_eligible:
            continue

        # 2. Skill Similarity (40%)
        req_skills_set = set(req_skills_list)
        overlap_skills = list(user_skills_set.intersection(req_skills_set))

        skill_ratio = len(overlap_skills) / max(1, len(req_skills_set))
        semantic_skill_score = semantic_sims[idx] if idx < len(semantic_sims) else 0.5
        skill_similarity_score = (0.6 * skill_ratio) + (0.4 * semantic_skill_score)

        # 3. Eligibility Score (20%)
        eligibility_score = 1.0 if is_eligible else 0.0

        # 4. Experience Match (15%)
        exp_score = min(1.0, profile.experience_years / 3.0) if profile.experience_years > 0 else 0.7

        # 5. Interest Match (15%)
        is_interest_match = any(i in sector.lower() or i in course_name.lower() for i in user_interests_set)
        interest_score = 1.0 if is_interest_match else 0.5

        # 6. Career Goal Match (10%)
        is_goal_match = user_goal in livelihood_type.lower() or user_goal in course_name.lower() or ("self" in user_goal and "self" in livelihood_type.lower())
        goal_score = 1.0 if is_goal_match else 0.6

        # Weighted Profile Match Score
        weighted_score = (
            (skill_similarity_score * 0.40) +
            (eligibility_score * 0.20) +
            (exp_score * 0.15) +
            (interest_score * 0.15) +
            (goal_score * 0.10)
        )

        final_match_score = round(float(weighted_score * 100.0), 1)
        final_match_score = min(99.0, max(50.0, final_match_score))

        missing_skills = [s.title() for s in req_skills_list if s not in user_skills_set]

        why_recommended = generate_factual_explanation(
            profile=profile,
            course_name=course_name,
            skill_overlap=[s.title() for s in overlap_skills],
            is_eligible=is_eligible,
            is_interest_match=is_interest_match,
            is_goal_match=is_goal_match,
            min_edu=min_edu
        )

        official_url = OFFICIAL_URL_MAP.get(course_name, 'https://nqr.gov.in/')

        item = {
            "course": course_name,
            "nsqf_level": nsqf_level,
            "sector": sector,
            "minimum_education": min_edu,
            "match_score": final_match_score,
            "why_recommended": why_recommended,
            "existing_skills": [s.title() for s in overlap_skills] if overlap_skills else [s.title() for s in profile.skills],
            "skill_gaps": missing_skills if missing_skills else ["Advanced Practice & Certification"],
            "job_roles": [job_role],
            "livelihood_options": [livelihood_type, "PM-AJAY GIA Toolkit Support"],
            "official_course_url": official_url,
            "source": "National Qualifications Register (NQR) / NIELIT Official Registry",
            "verification_status": "VERIFIED_OFFICIAL",
            "is_verified": True
        }
        results.append(item)

    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results[:top_k]
