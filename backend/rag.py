import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import json

class ConsultationRAG:

    def __init__(self):
        self.model = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

        self.chunks = []
        self.index = None

    def build_index(self, transcript, care_plan=None):

        care_plan_text = ""

        if care_plan:
            care_plan_text = f"""
    CONFIRMED CARE PLAN:

    Medications:
    {json.dumps(care_plan.get("medications", []), indent=2)}

    Tests:
    {json.dumps(care_plan.get("tests", []), indent=2)}

    Appointments:
    {json.dumps(care_plan.get("appointments", []), indent=2)}

    Instructions:
    {json.dumps(care_plan.get("instructions", []), indent=2)}
    """

        full_context = f"""
    CONSULTATION TRANSCRIPT:

    {transcript}

    {care_plan_text}
    """

        self.chunks = self._chunk_text(full_context)

        if not self.chunks:
            return

        embeddings = self.model.encode(
            self.chunks,
            convert_to_numpy=True
        ).astype("float32")

        faiss.normalize_L2(embeddings)

        self.index = faiss.IndexFlatIP(
            embeddings.shape[1]
        )

        self.index.add(embeddings)

    def search(self, question, k=3):

        if self.index is None or not self.chunks:
            return []

        query_embedding = self.model.encode(
            [question],
            convert_to_numpy=True
        ).astype("float32")

        faiss.normalize_L2(query_embedding)

        scores, indices = self.index.search(
            query_embedding,
            min(k, len(self.chunks))
        )

        results = []

        for score, index in zip(
            scores[0],
            indices[0]
        ):
            if index >= 0:
                results.append({
                    "text": self.chunks[index],
                    "score": float(score)
                })

        return results

    def _chunk_text(self, text, chunk_size=120):

        words = text.split()

        return [
            " ".join(words[i:i + chunk_size])
            for i in range(
                0,
                len(words),
                chunk_size
            )
            if words[i:i + chunk_size]
        ]