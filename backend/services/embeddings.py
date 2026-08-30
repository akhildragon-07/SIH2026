import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Tuple

# Try loading SentenceTransformers, with robust TF-IDF fallback if not available
try:
    from sentence_transformers import SentenceTransformer
    EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_SENTENCE_TRANSFORMERS = True
except Exception as e:
    EMBEDDING_MODEL = None
    HAS_SENTENCE_TRANSFORMERS = False

def compute_text_similarity(user_text: str, course_texts: List[str]) -> np.ndarray:
    """
    Computes semantic similarity scores between user profile text and course profile texts.
    Uses SentenceTransformers if available, otherwise TF-IDF Cosine Similarity.
    Returns 1D numpy array of similarity scores normalized between 0.0 and 1.0.
    """
    if not course_texts:
        return np.array([])

    if HAS_SENTENCE_TRANSFORMERS and EMBEDDING_MODEL is not None:
        try:
            user_emb = EMBEDDING_MODEL.encode([user_text])
            course_embs = EMBEDDING_MODEL.encode(course_texts)
            sims = cosine_similarity(user_emb, course_embs)[0]
            # Clip between 0 and 1
            return np.clip(sims, 0.0, 1.0)
        except Exception:
            pass

    # Fallback to TF-IDF Cosine Similarity
    corpus = [user_text] + course_texts
    vectorizer = TfidfVectorizer().fit_transform(corpus)
    user_vec = vectorizer[0:1]
    course_vecs = vectorizer[1:]
    sims = cosine_similarity(user_vec, course_vecs)[0]
    return np.clip(sims, 0.0, 1.0)
