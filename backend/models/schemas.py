from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BeneficiaryProfileRequest(BaseModel):
    name: Optional[str] = "Ravi"
    education: str = "10th"
    age: Optional[int] = 24
    state: Optional[str] = "Tamil Nadu"
    district: Optional[str] = "Theni"
    location: Optional[str] = "Tamil Nadu, Theni"
    occupation: Optional[str] = "Unemployed"
    experience_years: float = 0.0
    skills: List[str] = Field(default_factory=list)
    interest: Optional[str] = None
    interests: List[str] = Field(default_factory=list)
    career_goal: str = "self-employment"
    preferred_livelihood: Optional[str] = "Self-employment"

class ProfileExtractionRequest(BaseModel):
    text: str
    current_profile: Optional[BeneficiaryProfileRequest] = None

class RecommendationItem(BaseModel):
    course: str
    nsqf_level: int
    sector: str
    minimum_education: str
    match_score: float
    why_recommended: List[str]
    existing_skills: List[str]
    skill_gaps: List[str]
    job_roles: List[str]
    livelihood_options: List[str]
    official_course_url: str = "https://nqr.gov.in/"
    source: str = "National Qualifications Register (NQR)"
    verification_status: str = "VERIFIED_OFFICIAL"
    is_verified: bool = True

class SkillGapItem(BaseModel):
    skill_name: str
    importance: str
    is_missing: bool

class SkillGapResponse(BaseModel):
    target_course: str
    existing_skills: List[str]
    missing_skills: List[SkillGapItem]
    overall_match_percentage: float
    priority_focus: str

class CareerPathStep(BaseModel):
    step_number: int
    title: str
    stage: str
    description: str

class CareerPathResponse(BaseModel):
    beneficiary_goal: str
    recommended_qualification: str
    pathway: List[CareerPathStep]

class EvaluationMetricsResponse(BaseModel):
    precision_at_k: Dict[str, float]
    recall_at_k: Dict[str, float]
    f1_score_at_k: Dict[str, float]
    mrr: float
    ndcg_at_k: Dict[str, float]
    sample_size: int
    note: str = "Evaluated on sih_nsqf_1000_synthetic_training_records.csv DEMO dataset"
