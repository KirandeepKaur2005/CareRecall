import os
import json
import tempfile

from dotenv import load_dotenv

from flask import Flask, request, jsonify
from flask_cors import CORS

from groq import Groq
import google.generativeai as genai

load_dotenv()


app = Flask(__name__)

CORS(app)


# =========================================================
# API CLIENTS
# =========================================================

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

gemini_model = genai.GenerativeModel(
    "gemini-3.8-flash"
)


from rag import ConsultationRAG

rag = ConsultationRAG()


# =========================================================
# TRANSCRIPTION
# =========================================================

@app.route("/api/transcribe", methods=["POST"])
def transcribe():

    if "audio" not in request.files:
        return jsonify({
            "error": "No audio file provided"
        }), 400

    audio = request.files["audio"]

    temp_path = None

    try:

        extension = (
            os.path.splitext(
                audio.filename or ""
            )[1]
            or ".webm"
        )

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp:

            audio.save(temp.name)

            temp_path = temp.name

        with open(
            temp_path,
            "rb"
        ) as file:

            transcription = (
                groq_client
                .audio
                .transcriptions
                .create(
                    file=file,
                    model="whisper-large-v3-turbo",
                    response_format="text"
                )
            )


        return jsonify({
            "transcript": transcription
        })

    except Exception as e:

        print(
            "TRANSCRIPTION ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)


# =========================================================
# CARE PLAN EXTRACTION
# =========================================================

@app.route(
    "/api/extract-care-plan",
    methods=["POST"]
)
def extract_care_plan():

    data = request.get_json()

    transcript = data.get("transcript")

    if not transcript:

        return jsonify({
            "error": "Transcript is required"
        }), 400


    prompt = f"""
You are an information extraction assistant
for a doctor-patient consultation.

Your job is ONLY to extract instructions that
are explicitly present in the consultation.

IMPORTANT:
- Preserve medication names exactly as spoken in the consultation.
- Do not invent, alter, or "correct" medication names.
- Preserve the stated dosage separately from the medication name.
- If the transcript is unclear about a medication name, return the closest transcription and mark it as uncertain rather than confidently changing it.

Do NOT:
- diagnose
- infer missing information
- invent medication doses
- invent dates
- invent times
- invent durations
- provide medical advice

Return ONLY valid JSON.

Use exactly this structure:

{{
  "medications": [
    {{
      "name": "",
      "instructions": "",
      "duration": ""
    }}
  ],

  "tests": [
    {{
      "name": "",
      "date": "",
      "time": ""
    }}
  ],

  "appointments": [
    {{
      "description": "",
      "date": "",
      "time": ""
    }}
  ],

  "instructions": []
}}

If a category is not mentioned,
return an empty array.

CONSULTATION:

{transcript}
"""


    try:

        response = (
            gemini_model
            .generate_content(prompt)
        )

        text = response.text.strip()


        # Remove markdown code fences
        if text.startswith("```"):

            text = (
                text
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )


        care_plan = json.loads(text)


        return jsonify(care_plan)


    except Exception as e:

        print(
            "CARE PLAN ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500

# =========================================================
# CARE RECALL RAG AGENT
# =========================================================

@app.route("/api/build-rag", methods=["POST"])
def build_rag():

    data = request.get_json() or {}

    transcript = data.get("transcript")
    care_plan = data.get("care_plan")

    if not transcript:
        return jsonify({
            "error": "Transcript is required"
        }), 400

    try:

        rag.build_index(
            transcript,
            care_plan
        )

        return jsonify({
            "success": True
        })

    except Exception as e:

        print("RAG BUILD ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/api/ask", methods=["POST"])
def ask():

    data = request.get_json() or {}

    question = data.get("question", "").strip()
    language = data.get("language", "English")

    if not question:
        return jsonify({
            "error": "Question is required"
        }), 400

    # Retrieve relevant consultation chunks
    results = rag.search(
        question,
        k=3
    )

    if not results:

        return jsonify({
            "answer": (
                "I couldn't find this information "
                "in your consultation. Please contact "
                "your doctor for clarification."
            ),
            "source": None
        })

    context = "\n\n".join(
        result["text"]
        for result in results
    )

    prompt = f"""
You are CareRecall, a safe patient assistant.

You answer questions ONLY using the
consultation context provided below.

STRICT RULES:

- Never diagnose.
- Never prescribe.
- Never invent medical information.
- Never use outside medical knowledge.
- Never change medication instructions.
- Never recommend stopping or changing medication.
- If the consultation does not contain the answer,
  clearly say that the information is not present
  and advise the patient to contact their doctor.
- Keep the answer short and easy to understand.
- Answer in {language}.

CONSULTATION CONTEXT:

{context}

PATIENT QUESTION:

{question}

IMPORTANT RESPONSE FORMAT:
- Answer in simple, patient-friendly language.
- Do NOT use Markdown.
- Do NOT use **bold**, *, #, tables, or code formatting.
- If there are multiple instructions, use short numbered sentences.
- Keep the answer concise.
- Only answer using information found in the consultation.
- If the consultation does not contain the answer, say:
  "I couldn't find that in your doctor's consultation."

"""

    try:

        response = gemini_model.generate_content(
            prompt
        )

        answer = response.text.strip()

        return jsonify({
            "answer": answer,
            "source": "Your consultation"
        })

    except Exception as e:

        print(
            "RAG AGENT ERROR:",
            e
        )

        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "ok"
    })


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )