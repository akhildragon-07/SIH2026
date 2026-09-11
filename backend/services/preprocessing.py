import os
import pandas as pd
import numpy as np
from typing import Dict, List, Any

# Map education strings to numerical ranks for eligibility evaluation
EDUCATION_RANK_MAP = {
    'below 5th': 1,
    '5th': 2,
    '8th': 3,
    '10th': 4,
    '12th': 5,
    'iti': 5,
    'diploma': 5,
    'ug': 6,
    'graduate': 6,
    'pg': 7
}

DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'sih_nsqf_1000_synthetic_training_records.csv')

def parse_skills_string(skill_str: Any) -> List[str]:
    """Cleans and splits semi-colon or comma separated skill strings into clean lowercase lists."""
    if pd.isna(skill_str) or not skill_str:
        return []
    s = str(skill_str).replace(';', ',')
    return [item.strip().lower() for item in s.split(',') if item.strip()]

def get_education_rank(edu_str: str) -> int:
    """Returns numerical rank for comparison."""
    if not edu_str:
        return 1
    cleaned = str(edu_str).strip().lower()
    return EDUCATION_RANK_MAP.get(cleaned, 4)

def load_and_preprocess_dataset(csv_path: str = DATASET_PATH) -> pd.DataFrame:
    """Loads CSV, handles missing values, cleans skill lists, and sets up data structure."""
    if not os.path.exists(csv_path):
        # Fallback to local relative path
        csv_path = 'sih_nsqf_1000_synthetic_training_records.csv'

    df = pd.read_csv(csv_path)

    # Clean missing values
    df['education'] = df['education'].fillna('10th').astype(str)
    df['experience_years'] = pd.to_numeric(df['experience_years'], errors='coerce').fillna(0)
    df['existing_skills_list'] = df['existing_skills'].apply(parse_skills_string)
    df['recommended_skills_list'] = df['recommended_skills'].apply(parse_skills_string)
    
    # Handle both new column names and legacy _demo names
    skill_gap_col = 'skill_gaps' if 'skill_gaps' in df.columns else ('skill_gaps_demo' if 'skill_gaps_demo' in df.columns else 'recommended_skills')
    df['skill_gaps_list'] = df[skill_gap_col].apply(parse_skills_string)
    
    min_edu_col = 'minimum_education' if 'minimum_education' in df.columns else ('minimum_education_demo' if 'minimum_education_demo' in df.columns else 'education')
    df['education_rank'] = df[min_edu_col].apply(get_education_rank)
    
    if 'minimum_education_demo' not in df.columns and 'minimum_education' in df.columns:
        df['minimum_education_demo'] = df['minimum_education']
    if 'nsqf_level_demo' not in df.columns and 'nsqf_level' in df.columns:
        df['nsqf_level_demo'] = df['nsqf_level']
    if 'job_role_demo' not in df.columns and 'job_role' in df.columns:
        df['job_role_demo'] = df['job_role']
    if 'livelihood_type_demo' not in df.columns and 'livelihood_type' in df.columns:
        df['livelihood_type_demo'] = df['livelihood_type']

    return df

