"""
ml_model/recommender.py
Book Recommendation Engine using Cosine Similarity (Collaborative Filtering)
"""
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


class BookRecommender:
    """
    Hybrid recommender:
    1. Content-based: TF-IDF on title + author + genre
    2. Collaborative: user-item borrowing matrix → cosine similarity
    """

    def __init__(self):
        self.tfidf = TfidfVectorizer(stop_words="english")
        self.content_matrix = None
        self.books_df = None
        self.user_item_matrix = None

    # ------------------------------------------------------------------ #
    # Content-based filtering                                              #
    # ------------------------------------------------------------------ #
    def fit_content(self, books: list[dict]):
        """
        Build TF-IDF matrix from book metadata.
        books: list of {"id", "title", "author", "genre", "description"}
        """
        if not books:
            return
        self.books_df = books
        corpus = [
            f"{b.get('title','')} {b.get('author','')} {b.get('genre','')} {b.get('description','')}"
            for b in books
        ]
        self.content_matrix = self.tfidf.fit_transform(corpus)

    def content_recommend(self, book_id: int, top_n: int = 5) -> list[int]:
        """
        Return top-N book IDs similar to book_id by content.
        """
        if self.content_matrix is None or not self.books_df:
            return []

        ids = [b["id"] for b in self.books_df]
        if book_id not in ids:
            return []

        idx = ids.index(book_id)
        sim_scores = cosine_similarity(
            self.content_matrix[idx], self.content_matrix
        ).flatten()

        # Sort descending, skip itself
        ranked = np.argsort(sim_scores)[::-1]
        results = []
        for r in ranked:
            if ids[r] != book_id:
                results.append(ids[r])
            if len(results) >= top_n:
                break
        return results

    # ------------------------------------------------------------------ #
    # Collaborative filtering                                              #
    # ------------------------------------------------------------------ #
    def fit_collaborative(self, transactions: list[dict]):
        """
        Build user-item matrix from transaction history.
        transactions: list of {"user_id", "book_id"}
        """
        if not transactions:
            return

        users = sorted({t["user_id"] for t in transactions})
        books = sorted({t["book_id"] for t in transactions})
        user_idx = {u: i for i, u in enumerate(users)}
        book_idx = {b: i for i, b in enumerate(books)}

        matrix = np.zeros((len(users), len(books)))
        for t in transactions:
            u = user_idx[t["user_id"]]
            b = book_idx[t["book_id"]]
            matrix[u][b] += 1  # count borrows as rating

        self.user_item_matrix = {
            "matrix": matrix,
            "users": users,
            "books": books,
            "user_idx": user_idx,
            "book_idx": book_idx,
        }

    def collaborative_recommend(self, user_id: int, top_n: int = 5) -> list[int]:
        """
        Return top-N book IDs for user based on similar users' borrowing.
        """
        if self.user_item_matrix is None:
            return []

        m = self.user_item_matrix
        if user_id not in m["user_idx"]:
            return []

        u_idx = m["user_idx"][user_id]
        user_vec = m["matrix"][u_idx].reshape(1, -1)
        sim = cosine_similarity(user_vec, m["matrix"]).flatten()

        # Find most similar users (exclude self)
        similar_users = np.argsort(sim)[::-1]
        already_read = set(np.where(m["matrix"][u_idx] > 0)[0])

        book_scores = np.zeros(len(m["books"]))
        for su in similar_users[1:6]:  # top-5 similar users
            weight = sim[su]
            book_scores += m["matrix"][su] * weight

        # Zero out already-read books
        for idx in already_read:
            book_scores[idx] = 0

        top_idxs = np.argsort(book_scores)[::-1][:top_n]
        return [m["books"][i] for i in top_idxs if book_scores[i] > 0]


# ------------------------------------------------------------------ #
# Demand Forecasting (Linear Regression)                              #
# ------------------------------------------------------------------ #
class DemandPredictor:
    """
    Predicts future borrow demand for a book using simple linear regression
    on monthly borrow counts.
    """

    def predict_demand(self, monthly_counts: list[int]) -> dict:
        """
        monthly_counts: list of integer borrow counts (older → newer)
        Returns: { predicted_next_month, trend }
        """
        n = len(monthly_counts)
        if n < 2:
            return {"predicted_next_month": 0, "trend": "insufficient data"}

        x = np.arange(n).reshape(-1, 1)
        y = np.array(monthly_counts, dtype=float)

        # Manual least-squares (no sklearn import needed)
        x_mean = x.mean()
        y_mean = y.mean()
        numerator = ((x.flatten() - x_mean) * (y - y_mean)).sum()
        denominator = ((x.flatten() - x_mean) ** 2).sum()

        slope = numerator / denominator if denominator != 0 else 0
        intercept = y_mean - slope * x_mean

        next_val = max(0, round(slope * n + intercept))
        trend = "increasing" if slope > 0.5 else "decreasing" if slope < -0.5 else "stable"

        return {
            "predicted_next_month": int(next_val),
            "trend": trend,
            "slope": round(float(slope), 3),
        }
