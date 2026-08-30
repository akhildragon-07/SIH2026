import numpy as np
import pandas as pd
from typing import Dict, Any, List
from backend.services.preprocessing import load_and_preprocess_dataset
from backend.services.recommender import recommend_courses
from backend.models.schemas import BeneficiaryProfileRequest, EvaluationMetricsResponse

def evaluate_recommender(sample_size: int = 100, k_list: List[int] = [1, 3, 5]) -> EvaluationMetricsResponse:
    """
    Evaluates recommendation system performance on the synthetic dataset.
    Calculates:
    - Precision@K
    - Recall@K
    - F1-score@K
    - Mean Reciprocal Rank (MRR)
    - NDCG@K
    """
    df = load_and_preprocess_dataset()
    eval_df = df.head(sample_size)

    precision_k = {f"P@{k}": 0.0 for k in k_list}
    recall_k = {f"R@{k}": 0.0 for k in k_list}
    f1_k = {f"F1@{k}": 0.0 for k in k_list}
    ndcg_k = {f"NDCG@{k}": 0.0 for k in k_list}
    mrr_total = 0.0

    total_records = len(eval_df)

    for _, row in eval_df.iterrows():
        ground_truth = str(row['recommended_qualification']).strip().lower()
        skills = row['existing_skills_list']
        interests = [str(row['interest']).strip().lower()] if pd.notna(row['interest']) else []

        profile = BeneficiaryProfileRequest(
            name="EvalUser",
            education=str(row['education']),
            age=int(row['age']) if pd.notna(row['age']) else 25,
            location=str(row['location']),
            occupation=str(row['current_occupation']),
            experience_years=float(row['experience_years']),
            skills=skills,
            interests=interests,
            career_goal=str(row['career_goal']),
            preferred_livelihood=str(row['career_goal'])
        )

        recs = recommend_courses(profile, top_k=max(k_list))
        rec_names = [r['course'].strip().lower() for r in recs]

        # Calculate MRR
        rank = -1
        for idx, rec_name in enumerate(rec_names):
            if ground_truth in rec_name or rec_name in ground_truth:
                rank = idx + 1
                break

        if rank > 0:
            mrr_total += (1.0 / rank)

        # Calculate Precision, Recall, NDCG for each K
        for k in k_list:
            top_k_recs = rec_names[:k]
            hit = any(ground_truth in r or r in ground_truth for r in top_k_recs)

            p_val = 1.0 / k if hit else 0.0
            r_val = 1.0 if hit else 0.0

            precision_k[f"P@{k}"] += p_val
            recall_k[f"R@{k}"] += r_val

            if p_val + r_val > 0:
                f1_k[f"F1@{k}"] += 2 * (p_val * r_val) / (p_val + r_val)

            if hit:
                hit_idx = next(i for i, r in enumerate(top_k_recs) if ground_truth in r or r in ground_truth)
                dcg = 1.0 / np.log2(hit_idx + 2)
                idcg = 1.0
                ndcg_k[f"NDCG@{k}"] += (dcg / idcg)

    # Average metrics
    avg_precision = {k: round(v / total_records, 4) for k, v in precision_k.items()}
    avg_recall = {k: round(v / total_records, 4) for k, v in recall_k.items()}
    avg_f1 = {k: round(v / total_records, 4) for k, v in f1_k.items()}
    avg_ndcg = {k: round(v / total_records, 4) for k, v in ndcg_k.items()}
    mrr_avg = round(mrr_total / total_records, 4)

    return EvaluationMetricsResponse(
        precision_at_k=avg_precision,
        recall_at_k=avg_recall,
        f1_score_at_k=avg_f1,
        mrr=mrr_avg,
        ndcg_at_k=avg_ndcg,
        sample_size=total_records,
        note="Evaluated actual similarity & eligibility metrics on sih_nsqf_1000_synthetic_training_records.csv dataset."
    )

if __name__ == '__main__':
    metrics = evaluate_recommender(sample_size=100)
    print("--- EVALUATION METRICS ---")
    print(metrics.model_dump_json(indent=2))
