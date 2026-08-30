from typing import List, Dict, Any
from backend.models.schemas import BeneficiaryProfileRequest, SkillGapResponse, SkillGapItem

def analyze_skill_gap(profile: BeneficiaryProfileRequest, target_course: str, required_skills: List[str]) -> SkillGapResponse:
    """
    Compares existing user skills against course required skills.
    Assigns priority ratings (Critical, Recommended, Optional) to missing skills.
    Calculates overall match percentage.
    """
    user_skills_lower = set([s.lower() for s in profile.skills])
    req_skills_lower = [s.lower() for s in required_skills]

    existing_matched = [s.title() for s in required_skills if s.lower() in user_skills_lower]
    missing_items: List[SkillGapItem] = []

    for idx, skill in enumerate(required_skills):
        skill_l = skill.lower()
        if skill_l not in user_skills_lower:
            importance = "Critical" if idx == 0 else "Recommended" if idx == 1 else "Optional"
            missing_items.append(SkillGapItem(
                skill_name=skill.title(),
                importance=importance,
                is_missing=True
            ))

    total_req = len(required_skills)
    match_pct = round((len(existing_matched) / max(1, total_req)) * 100.0, 1)

    priority_focus = missing_items[0].skill_name if missing_items else "Advanced Industry Certification"

    return SkillGapResponse(
        target_course=target_course,
        existing_skills=[s.title() for s in profile.skills],
        missing_skills=missing_items,
        overall_match_percentage=match_pct,
        priority_focus=priority_focus
    )
