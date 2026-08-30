from typing import List, Dict, Any
from backend.models.schemas import BeneficiaryProfileRequest, CareerPathResponse, CareerPathStep

def generate_career_pathway(profile: BeneficiaryProfileRequest, target_qualification: str, sector: str) -> CareerPathResponse:
    """
    Generates structured career knowledge graph steps:
    Skill -> Qualification -> Certification -> Job Role -> Advanced Skill -> Career -> Self Employment / Entrepreneurship
    """
    goal = profile.career_goal or "Self-employment"
    skills_str = ", ".join([s.title() for s in profile.skills]) if profile.skills else "Basic Practical Skills"

    steps: List[CareerPathStep] = [
        CareerPathStep(
            step_number=1,
            title="Baseline Skill Foundation",
            stage="Skill",
            description=f"Existing verified skills: {skills_str}. Education: {profile.education} ({profile.experience_years} yrs experience)."
        ),
        CareerPathStep(
            step_number=2,
            title=f"NSQF Training: {target_qualification}",
            stage="Qualification",
            description=f"Undergo zero-cost NSQF Level 3-4 skilling in {sector} under PM-AJAY GIA Component."
        ),
        CareerPathStep(
            step_number=3,
            title="Official NCVET Skill Certification",
            stage="Certification",
            description=f"Obtain NCVET certified credential opening access to government toolkits and credit linkage."
        ),
        CareerPathStep(
            step_number=4,
            title=f"Livelihood Placement / Industry Role",
            stage="Job Role",
            description=f"Initial placement as {sector} associate or practical workshop technician."
        ),
        CareerPathStep(
            step_number=5,
            title="Advanced Competency Mastery",
            stage="Advanced Skill",
            description="Master digital marketing, equipment maintenance, pricing, and client management."
        ),
        CareerPathStep(
            step_number=6,
            title=f"PM-AJAY GIA Enterprise & {goal}",
            stage="Self Employment / Entrepreneurship",
            description=f"Establish independent {goal} enterprise utilizing PM-AJAY GIA toolkit grant & financial subsidy."
        )
    ]

    return CareerPathResponse(
        beneficiary_goal=goal,
        recommended_qualification=target_qualification,
        pathway=steps
    )
