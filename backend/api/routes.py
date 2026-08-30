from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any

from backend.models.schemas import (
    BeneficiaryProfileRequest,
    ProfileExtractionRequest,
    RecommendationItem,
    SkillGapResponse,
    CareerPathResponse,
    EvaluationMetricsResponse
)
from backend.services.recommender import recommend_courses, DATASET_DF
from backend.services.skill_gap import analyze_skill_gap
from backend.services.career_mapper import generate_career_pathway
from backend.evaluation.metrics import evaluate_recommender

router = APIRouter()

@router.post("/recommend", response_model=List[RecommendationItem])
def get_recommendations(profile: BeneficiaryProfileRequest, top_k: int = Query(5, ge=1, le=10)):
    """Generates top-K explainable NSQF course recommendations based on profile & eligibility."""
    try:
        recs = recommend_courses(profile, top_k=top_k)
        return recs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@router.post("/profile/extract")
def extract_profile_endpoint(req: ProfileExtractionRequest):
    """Extracts structured beneficiary profile fields from natural language text."""
    text = req.text.lower()
    profile = req.current_profile or BeneficiaryProfileRequest()

    # Simple keyword extraction logic
    if "10th" in text or "tenth" in text:
        profile.education = "10th"
    elif "12th" in text or "twelfth" in text:
        profile.education = "12th"
    elif "8th" in text or "eighth" in text:
        profile.education = "8th"
    elif "5th" in text or "fifth" in text:
        profile.education = "5th"
    elif "diploma" in text:
        profile.education = "Diploma"
    elif "degree" in text or "graduate" in text or "ug" in text:
        profile.education = "UG"

    # Skill extraction
    skills = list(profile.skills)
    skill_map = {
        "tailor": "tailoring",
        "stich": "stitching",
        "sew": "sewing",
        "computer": "basic computer",
        "typing": "typing",
        "farm": "farming",
        "repair": "repair",
        "mobile": "mobile repair",
        "solar": "solar installation",
        "electrician": "wiring"
    }
    for kw, sk in skill_map.items():
        if kw in text and sk not in skills:
            skills.append(sk)
    profile.skills = skills

    # Goal extraction
    if "self" in text or "business" in text or "shop" in text or "own" in text:
        profile.career_goal = "self-employment"
        profile.preferred_livelihood = "Self-employment"
    elif "job" in text or "company" in text or "salary" in text:
        profile.career_goal = "job"
        profile.preferred_livelihood = "Job"

    return {"extracted_profile": profile}

@router.post("/skill-gap", response_model=SkillGapResponse)
def get_skill_gap(profile: BeneficiaryProfileRequest, target_course: str = "Sewing Machine Operator", required_skills: Optional[List[str]] = None):
    """Calculates existing skills vs missing skills with priority focus."""
    if not required_skills:
        required_skills = ["tailoring", "sewing", "stitching", "machine operation", "garment finishing"]
    return analyze_skill_gap(profile, target_course, required_skills)

@router.post("/career-path", response_model=CareerPathResponse)
def get_career_path(profile: BeneficiaryProfileRequest, target_qualification: str = "Sewing Machine Operator", sector: str = "Apparel"):
    """Generates personalized career knowledge graph roadmap."""
    return generate_career_pathway(profile, target_qualification, sector)

@router.get("/courses")
def get_all_courses():
    """Returns catalog of unique NSQF courses available in training dataset."""
    unique_courses = DATASET_DF[['recommended_qualification', 'sector', 'nsqf_level_demo', 'minimum_education_demo']].drop_duplicates().to_dict(orient='records')
    return {"total": len(unique_courses), "courses": unique_courses}

@router.get("/evaluate", response_model=EvaluationMetricsResponse)
def get_evaluation(sample_size: int = Query(100, ge=10, le=1000)):
    """Runs recommendation evaluation metrics (Precision@K, Recall@K, MRR, NDCG@K)."""
    return evaluate_recommender(sample_size=sample_size)
