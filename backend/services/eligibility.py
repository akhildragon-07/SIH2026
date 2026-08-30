from backend.services.preprocessing import get_education_rank

def check_course_eligibility(user_education: str, user_exp: float, course_min_education: str, course_min_exp: float = 0.0) -> bool:
    """
    Checks if a beneficiary satisfies the course eligibility requirements.
    Rules:
    - User education rank must be >= required course minimum education rank.
    - User experience must be >= required experience.
    Returns True if eligible, False otherwise.
    """
    user_edu_rank = get_education_rank(user_education)
    course_edu_rank = get_education_rank(course_min_education)

    # Beneficiary must satisfy minimum education
    if user_edu_rank < course_edu_rank:
        return False

    # Experience check
    if user_exp < course_min_exp:
        return False

    return True
